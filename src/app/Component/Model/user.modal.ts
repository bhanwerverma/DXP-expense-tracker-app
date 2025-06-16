export interface UserLogin {
    id?: number,
    FirstName: string,
    LastName: string,
    Gender: 'Male' | 'Female' | 'Others',
    Email: string,
    Password: string,
    role:"Admin"|"User"
}