import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { User } from '../../../shared/domain/entities/user'
import { TokenAuth } from '../../../shared/helpers/external_interfaces/token_auth'
import { MissingParameters, UserNotAllowed, UserNotAuthenticated } from '../../../shared/helpers/errors/controller_errors'
import { ROLE } from '../../../shared/domain/enums/role_enum';
import { v4 as uuid } from 'uuid';

export class OAuthUserUsecase {
    public token_auth: TokenAuth;
    public database_repo: IUserRepository;

    constructor(database_repo: IUserRepository) {
        this.token_auth = new TokenAuth();
        this.database_repo = database_repo;
    }

    public async execute(token: string): Promise<{ token: string, created_user: boolean }> {
        if (!token) {
            throw new MissingParameters("token azure");
        }

        const token_response = await this.token_auth.verify_azure_token(token)
            .then
            (response => {
                return response;
            }).catch(error => {
                throw new UserNotAuthenticated(error.message);
            });

        const padrao: RegExp = /@maua\.br$/;
        if (!padrao.test(token_response.mail)) {
            throw new UserNotAllowed('Invalid Email, must be a maua.br domain.');
        }

        let user: User;
        const get_user = await this.database_repo.getUserByEmail(token_response.mail);

        if (get_user) {
            if (!get_user.name) {
                get_user.name = token_response.displayName.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                await this.database_repo.updateUser(get_user);
            }
            user = new User({
                id: get_user.id,
                name: get_user.name,
                email: get_user.email,
                role: get_user.role,
                createdAt: get_user.createdAt,
                updatedAt: get_user.updatedAt
            });
        } else {
            user = new User({
                id: uuid(),
                name: token_response.displayName.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), // title case
                email: token_response.mail,
                role: ROLE.STUDENT,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await this.database_repo.createUser(user);
        }

        return {
            token: await this.token_auth.generate_token(user.id),
            created_user: !get_user
        }
    }
}