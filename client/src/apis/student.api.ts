import { Student, Students } from "types/studentType";
import http from "utils/http";

// Lay danh sach sinh vien
export const getStudents = (page: number | string, limit: number | string) => {
    return http.get<Students>('students', {
        params: {
            _page: page,
            _limit: limit
        }
    })
}

// Them sinh vien
export const addStudent = (student: Omit<Student, 'id'>) => {
    return http.post<Student>('students', student);
}