import {
  BsArrowBarRight,
  BsEye,
  BsEyeSlash,
  BsFillPersonFill,
  BsLockFill,
} from "react-icons/bs";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { ChangeEvent, FormEvent, useState } from "react";
import PersonDB from "../data/PersonDB";

function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login.handleSubmit: Logging as");
    console.log(JSON.stringify(loginData));
    PersonDB.SignInAsAdmin(loginData.username, loginData.password);
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const [showPasswd, setShowPasswd] = useState("password");
  const onTogglePassword = () => {
    if (showPasswd === "password") {
      setShowPasswd("text");
    } else {
      setShowPasswd("password");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col font-inter">
      <h3 className="font-bold mb-4">
        <div className="flex justify-center items-center">
          <BsFillPersonFill className="mr-2 mb-1" />
          Login as Admin
        </div>
      </h3>
      <form className="h-[50%] w-[90%] sm:w-[50%]" onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <InputGroup.Text>@</InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Email"
            name="username"
            onChange={onChangeInput}
          />
        </InputGroup>

        <InputGroup>
          <InputGroup.Text>
            <BsLockFill />
          </InputGroup.Text>
          <FormControl
            type={showPasswd}
            placeholder="Password"
            name="password"
            onChange={onChangeInput}
          />
          <InputGroup.Text onClick={onTogglePassword}>
            {showPasswd === "password" ? (
              <BsEyeSlash style={{ cursor: "pointer" }} />
            ) : (
              <BsEye style={{ cursor: "pointer" }} />
            )}
          </InputGroup.Text>
        </InputGroup>

        <Button type="submit" className="mt-4 w-full">
          <div className="flex justify-center items-center">
            <BsArrowBarRight size={20} className="mr-2" />
            Login
          </div>
        </Button>
      </form>
    </div>
  );
}

export default Login;
