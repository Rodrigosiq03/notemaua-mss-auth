import students from '../infra/jsons/students.json'
import { User } from '../domain/entities/user' 

export function generateAllUsersFromJson() {
  const users: User[] = []
  for (const student of students) {
    const user = new User({
      name: student.student,
      ra: student.ra,
      email: `${student.ra}@maua.br`,
    })

    users.push(user)
  }

  return users
}