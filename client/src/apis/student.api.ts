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

// Lay sinh vien theo id
export const getStudent = (id: string | number) => {
    return http.get<Student>(`students/${id}`)
}

// Them sinh vien
export const addStudent = (student: Omit<Student, 'id'>) => {
    return http.post<Student>('students', student);
}

// Cap nhat sinh vien
export const updateStudent = (id: string | number, student: Student) => {
    return http.put<Student>(`students/${id}`, student)
}

// Xoa sinh vien
export const deleteStudent = (id: string | number) => {
    return http.delete<{}>(`students/${id}`);
}