import { useSearchParams } from "react-router-dom"

export const useQueryString = () => {
    const [searchParams] = useSearchParams();
    const searchParamObject = Object.fromEntries([...searchParams]);
    // Dòng này chuyển đổi đối tượng URLSearchParams thành một đối tượng JavaScript thông thường. 
    // Để làm điều này, trước hết chúng ta tạo một mảng từ các cặp key-value của URLSearchParams bằng cách sử dụng toán tử spread [...searchParams]. 
    // Sau đó, Object.fromEntries() được sử dụng để chuyển đổi mảng này thành đối tượng.
    return searchParamObject;
    // Cuối cùng, hook trả về đối tượng JavaScript chứa các tham số truy vấn từ URL.
}