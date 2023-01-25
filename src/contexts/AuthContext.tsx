import { createContext, ReactNode, useState } from "react";

import { api } from "../services/apiClient";

import { destroyCookie, setCookie, parseCookies }  from "nookies";

import Router from 'next/router';


type AuthConstextData = {
    user:UserProps;
    IsAuthenticated:boolean;
    singIn: (credentials: SingInProps)=> Promise<void>;
    singOut: () => void;
}

type UserProps = {
    id:string;
    name:string;
    email:string;
}

type SingInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthConstextData)

export function singOut(){
    try{
        destroyCookie(undefined, '@nextauth.token');
        Router.push('/')

    }catch{
        console.log('error ao deslogar');
    }
}

export function AuthProvider ({children}: AuthProviderProps){

    const [user, setUser] = useState<UserProps>();

    const IsAuthenticated = !!user;

    async function singIn({ email, password }: SingInProps){
        try{

            const response = await api.post('/session',{
                email,
                password
            })
            
            console.log(response.data);
            
            const {id, name, token} = response.data;

            setCookie(undefined, '@nextauth.token', token,{
                maxAge:60 * 60 * 24 * 30, // expira em um 1 mês
                path: '/' // quais caminhos terao acesso ao cookie
            })

            setUser({
                id,
                name, 
                email,
            })

            // passar para proximas requisições o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            // redirecionar o user para dashboard

            Router.push('/dashboard')


        }catch(err){
            console.log('Error ao acessar', err);
            
        }
        
    }

    return(
        <AuthContext.Provider value={{ user,IsAuthenticated, singIn, singOut }}>
            {children}
        </AuthContext.Provider>
    )
}
