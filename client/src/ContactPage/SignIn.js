import React,{useState,useEffect} from 'react'
import './SignIn.css'

import { useDispatch } from 'react-redux'
import { signin,addUser } from '../actions/index'

import { useHistory } from "react-router-dom";

function SignIn() {
    var history = useHistory()

    const dispatch = useDispatch()

    const [error,setError] = useState("")
    const [errorLogin,setErrorLogin] = useState("")
    const [signInData,setSignInData] = useState({email:"",password:""})
    const [signUpData,setSignUpData] = useState({firstname:"",lastname:"",email:"",password:"",confPassword:""})

    useEffect(() => {
        console.log('ca marche')
    }, [error])
    useEffect(() => {
        console.log('ca marche')
    }, [errorLogin])

    var signIn = ()=>{

        fetch("/users/signin",{
            method: "POST",
            body: JSON.stringify({email:signInData.email,password:signInData.password}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
        }).then(response=> {
            return response.json()
        })
        .then(data=>{
            console.log("retour fetch",data);

            if(data.result){
                dispatch(signin())
                dispatch(addUser(data.user))
                history.push("/")
            }else{
                setErrorLogin(data.error)
                setError("")
            }

        })
        .catch((error)=>{
            console.log("Request failed recup user", error );
            
        })

    }

    var signUp = ()=>{
        if(signUpData.firstname.length === 0 || signUpData.lastname.length === 0){
            setErrorLogin("")
            setError("Missing a lastname or a firstname")
        }else{
        // verfi password regex
        if(!signUpData.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})$/)){

            setErrorLogin("")
            setError("At least 1 uppercase, one lowercase , one number and a total of 6 characters and can't include specials characters");

        }else{
            if(signUpData.password !== signUpData.confPassword){

                setErrorLogin("")
                setError('both password you typed are different');

            }else{
                console.log('ok');

                fetch("/users/signup",{
                    method: "POST",
                    body: JSON.stringify({
                        firstname:signUpData.firstname,
                        lastname:signUpData.lastname,
                        email:signUpData.email,
                        password:signUpData.password
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
                }).then(response=> {
                    return response.json()
                })
                .then(data=>{
                    console.log("retour fetch",data);

                    if(data.result){
                        dispatch(signin())
                        dispatch(addUser(data.user))
                        history.push("/")
                    }else{
                        setError(error)
                        setErrorLogin("")
                        console.log('pas ok ==> email exist déjà');
                        setError('Email already taken');
                    }

                })
                .catch((error)=>{
                    console.log("Request failed recup user", error );
                    
                })


            }

        }}

    }

    return (
        <div className='signin__page'>
            <div className='subscribe__form__container'>
                <h2>Create an Account</h2>
                <input required type='text' placeholder='First Name' value={signUpData.firstname} onChange={(e)=>{
                    var copySignUpData = {...signUpData}
                    copySignUpData.firstname = e.target.value
                    setSignUpData(copySignUpData)
                }} ></input>
                <input required type='text' placeholder='Last Name' value={signUpData.lastname} onChange={(e)=>{
                    var copySignUpData = {...signUpData}
                    copySignUpData.lastname = e.target.value
                    setSignUpData(copySignUpData)
                }} ></input>
                <input required type='email' placeholder='Email' value={signUpData.email} onChange={(e)=>{
                    var copySignUpData = {...signUpData}
                    copySignUpData.email = e.target.value
                    setSignUpData(copySignUpData)
                }} ></input>
                <input required type='password' placeholder='Password'  value={signUpData.password} onChange={(e)=>{
                    var copySignUpData = {...signUpData}
                    copySignUpData.password = e.target.value
                    setSignUpData(copySignUpData)
                }} ></input>
                <input required type='password' placeholder='Confirm Password' value={signUpData.confPassword} onChange={(e)=>{
                    var copySignUpData = {...signUpData}
                    copySignUpData.confPassword = e.target.value
                    setSignUpData(copySignUpData)
                }} ></input>
                <div className='error__message__login'>{error}</div>
                <div className='buttons__register' onClick={signUp}>Register</div>
            </div>

            <div className='login__form__container'>
                <h2>Already have an account ?</h2>
                <input required type='email' placeholder='Email' value={signInData.email} onChange={(e)=>{
                    var copySignInData = {...signInData}
                    copySignInData.email = e.target.value
                    setSignInData(copySignInData)
                }}></input>
                <input required type='password' placeholder='Password' value={signInData.password} onChange={(e)=>{
                    var copySignInData = {...signInData}
                    copySignInData.password = e.target.value
                    setSignInData(copySignInData)
                }}></input>
                <div className='error__message__login'>{errorLogin}</div>
                <div className='buttons__register' onClick={signIn} >Login</div>
                
            </div>
        </div>
    )
}

export default SignIn
