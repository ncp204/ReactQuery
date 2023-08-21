import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useMatch, useParams } from "react-router-dom"
import { isAxiosError } from "utils/utils";

import { addStudent, getStudent, updateStudent } from "apis/student.api";

import { Student } from "types/studentType";

const GENDER = {
  male: 'Male',
  female: 'Female',
  other: 'Other'
}

type FormStateType = Omit<Student, 'id'>;
const initialFormState: FormStateType = {
  avatar: '',
  btc_address: '',
  country: '',
  email: '',
  first_name: '',
  gender: GENDER.other,
  last_name: ''
}

type ErrorForm = {
  [key in keyof FormStateType]: string
} | null

export default function AddStudent() {
  const addMatch = useMatch('/students/add');
  const isAddMode = Boolean(addMatch);
  const { id } = useParams();

  const [formState, setFormState] = useState<FormStateType>(initialFormState);

  const addStudentMutation = useMutation({
    mutationFn: (body: FormStateType) => {
      return addStudent(body);
    }
  })

  const queryClient = useQueryClient();

  const getStudentQuery = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudent(id as string),
    enabled: id !== undefined,
    staleTime: 10 * 1000,
    onSuccess: (data) => {
      setFormState(data.data)
    }
  })

  useEffect(() => {
    if (getStudentQuery.data) {
      setFormState(getStudentQuery.data.data)
    }
  }, [getStudentQuery.data])

  const updateStudentMutation = useMutation({
    mutationFn: (_) => {
      return updateStudent(id as string, formState as Student);
    },
    onSuccess(data) {
      queryClient.setQueryData(['student', id], data);
    }
  })

  const errorForm: ErrorForm = useMemo(() => {
    const error = isAddMode ? addStudentMutation.error : updateStudentMutation.error;
    if (isAxiosError<{ error: ErrorForm }>(error) && error.response?.status === 422) {
      return error.response.data.error
    }
    return null;
  }, [addStudentMutation.error, isAddMode, updateStudentMutation.error])

  // Cú pháp currying
  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    if (addStudentMutation.data || addStudentMutation.error) {
      addStudentMutation.reset();
    }
    if (updateStudentMutation.data || updateStudentMutation.error) {
      updateStudentMutation.reset();
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAddMode) {
      addStudentMutation.mutate(formState, {
        onSuccess(data) {
          setFormState(initialFormState);
          console.log('Them thanh cong sinh vien', data);

        }
      })
    } else {
      updateStudentMutation.mutate(undefined, {
        onSuccess(_) {
          console.log('Cap nhat thanh cong');
        }
      })
    }

  }

  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? 'Add' : 'Edit Student'}</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='floating_email'
            id='floating_email'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
            placeholder=' '
            value={formState.email}
            onChange={handleChange('email')}
            required
          />
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Email address
          </label>
          {
            errorForm && (
              <p className='mt-2 text-sm text-red-600'>
                {errorForm.email}
                {errorForm.avatar}
              </p>
            )
          }
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  name='gender'
                  value={GENDER.male}
                  onChange={handleChange('gender')}
                  checked={formState.gender === GENDER.male}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500  dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  name='gender'
                  value={GENDER.female}
                  onChange={handleChange('gender')}
                  checked={formState.gender === GENDER.female}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500  dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Female
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='gender-3'
                  type='radio'
                  name='gender'
                  value={GENDER.other}
                  onChange={handleChange('gender')}
                  checked={formState.gender === GENDER.other}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500  dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            id='country'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0   '
            placeholder=' '
            required
            value={formState.country}
            onChange={handleChange('country')}
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='first_name'
              id='first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0   '
              placeholder=' '
              required
              value={formState.first_name}
              onChange={handleChange('first_name')}
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0   '
              placeholder=' '
              required
              value={formState.last_name}
              onChange={handleChange('last_name')}
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0   '
              placeholder=' '
              required
              value={formState.avatar}
              onChange={handleChange('avatar')}
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0   '
              placeholder=' '
              required
              value={formState.btc_address}
              onChange={handleChange('btc_address')}
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
        >
          {isAddMode ? 'Add' : 'Update'}
        </button>
      </form>
    </div>
  )
}
