import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { POST } from "../services/api";
import { toast } from "react-toastify";

const LoginRegister = () => {
    const nav = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPlaintext, setShowPlaintext] = useState(false);
    const [formData, setFormData] = useState<{ [key: string]: string }>({});

    const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmission = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.email) return toast("Finish filling out the login form, please");

        if (!isLogin && !formData.name) return toast("Please fill in your name.");

        const data = {
            ...formData
        };

        const path = `/auth/${isLogin ? "login" : "register"}`;

        try {
            const res = await POST(path, data);

            if (res.ok) {
                const { message, token } = await res.json();
                localStorage.setItem("token", token);
                toast.success(message);
                nav("/profile", { state: { token } });
            } else {
                const { message, error } = await res.json();
                toast.error(message);
                console.log({ message, error });
            }
        } catch (error) {
            toast.error(error);
            console.log({ error });
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6">
                <div className="card rounded-3 shadow-lg">
                    <div className="card-header">
                        <div className="row justify-content-between">
                            <h1 className="col-6">{isLogin ? "Sign In" : "Register"}</h1>
                            <p
                                onClick={() => setIsLogin(prevState => !prevState)}
                                className="d-flex align-items-center justify-content-center col-3 badge rounded-pill text-white bg-info">
                                {!isLogin ? "Sign In" : "Register"}?
                            </p>
                        </div>
                    </div>
                    <div className="card-body bg-white">
                        <form>
                            <label>
                                Email: <span className="text-danger">{formData.email ? "" : "*"}</span>
                            </label>
                            <input className="form-control m-2" onChange={handleFormUpdate} name="email" type="email" />
                            {!isLogin && (
                                <label>
                                    Your name: <span className="text-danger">{formData.name ? "" : "*"}</span>
                                </label>
                            )}
                            {!isLogin && <input className="form-control m-2" onChange={handleFormUpdate} name="name" type="text" />}
                            <label>
                                Password: <span className="text-danger">{formData.password ? "" : "*"}</span>
                            </label>
                            <input
                                className="form-control m-2"
                                onChange={handleFormUpdate}
                                name="password"
                                type={showPlaintext ? "text" : "password"}
                            />
                            {formData.password && (
                                <label onClick={() => setShowPlaintext(prevState => !prevState)}>
                                    {showPlaintext ? "Hide " : "Show "} password?
                                </label>
                            )}

                            <div className="row mt-2 px-4">
                                <button
                                    onClick={handleSubmission}
                                    disabled={!formData.password || !formData.email || (!isLogin && !formData.name)}
                                    className="btn rounded-pill btn-dark">
                                    {!formData.password || !formData.email || (!isLogin && !formData.name)
                                        ? `Some fields are remaining`
                                        : isLogin
                                        ? "Log In!"
                                        : "Register!"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
