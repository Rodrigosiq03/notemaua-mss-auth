import students from '../infra/jsons/students.json'

export function validateStudent(ra: string) {
  const student = students.find(student => student.ra === ra)
  if (!student) {
    return false
  }
  return true
}

export function getUserName(ra: string) {
  const student = students.find(student => student.ra === ra)
  if (!student) {
    return null
  }
  return student.student
}