"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import AuthArt from '@/components/AuthArt';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AxiosError } from "axios";

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const onlyWidth = useWindowWidth();
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            console.log("Before the post request-------------");
            const res = await axios.post('/api/register', formData);
            console.log("After the post request------------------");
            if (res.status === 201) {
                router.push('/login');
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string; error?: string }>;
            
            if (axiosError.response?.status === 409 || axiosError.response?.status === 422) {
                setError(axiosError.response.data.message);
                return;
            }
        
            console.error("Registration error:", axiosError.response?.data?.error || axiosError.message);
        }
    };

    function containsSpaceOrSpecialChars(str: string): boolean {
        const regex = /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
        return regex.test(str);
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div>
            <div className='flex justify-center items-center h-[45rem]'>
                <div className='w-full'>
                    <div className="bg-grey-lighter min-h-screen flex flex-col justify-center">
                        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                            <form onSubmit={handleSubmit} className="bg-gray-200 px-6 py-8 rounded shadow-md text-black w-full">
                                <h1 className="mb-8 text-3xl text-purp font-bold text-center">Sign up</h1>
                                <input type="text" className="block border bg-lightbg border-grey-light w-full p-3 rounded mb-4" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                                {containsSpaceOrSpecialChars(formData.username) && (<div className='text-sm text-red-600'>*Username cannot contain special characters or spaces</div>)}
                                <input type="email" className="block border bg-lightbg border-grey-light w-full p-3 rounded mb-4" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                                <input type="password" className="block border bg-lightbg border-grey-light w-full p-3 rounded mb-4" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                <input type="password" className="block border bg-lightbg border-grey-light w-full p-3 rounded mb-4" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                                {error && <div className="text-sm text-red-600">{error}</div>}
                                <button type="submit" className="w-full text-center py-3 text-white bg-purp font-medium hover:font-bold transition-all ease-in-out duration-100 hover:bg-yell rounded focus:outline-none my-1">Create Account</button>
                                <div className="text-center text-sm text-grey-dark mt-4">
                                    By signing up, you agree to the <a className="no-underline border-b border-grey-dark text-purp" href="#">Terms of Service</a> and <a className="no-underline border-b border-grey-dark text-purp" href="#">Privacy Policy</a>
                                </div>
                            </form>
                            <div className="mt-6">
                                Already have an account? <a className="no-underline border-b border-blue text-purp" href="../login/">Log in</a>.
                            </div>
                        </div>
                    </div>
                </div>
                {isMounted && onlyWidth >= 639 && (<div className='w-full mr-6'><AuthArt /></div>)}
            </div>
        </div>
    );
};

export default Register;
