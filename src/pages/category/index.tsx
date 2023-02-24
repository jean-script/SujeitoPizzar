import { useState, FormEvent } from "react";
import Head from "next/head";
import { Header } from "../../contexts/Header";
import styles from "./styles.module.scss";

import { setupApiClient } from "../../services/api";
import { toast } from "react-toastify";

import { canSSAuth } from '../../utils/canSSRAuth'

export default function Category(){

    const [name, setName] = useState('');

    async function handleRegister(event:FormEvent){
        event.preventDefault();

        if (name ===''){
            toast.error('Preencha o campo nome!')
            return;
        }

        const apiClient = setupApiClient();

        await apiClient.post('/category', {
            name:name
        })

        toast.success('Categoria cadastrada com sucesso!');

        setName('');

    }

    return(
        <>
        <Head>
            <title>Nova categoria - Sujeito categoria</title>

        </Head>
        <div>
            <Header></Header>
        </div>
        <main className={styles.container}>
            <h1>Cadastrar categorias</h1>

            <form className={styles.form}  onSubmit={handleRegister}>
                <input 
                type="text"
                placeholder="Digite o nome da categoria"
                className={styles.input}
                value={name}
                onChange={ (e) => setName(e.target.value) }
                />

                <button  className={styles.buttonAdd} type="submit">
                    Cadastrar
                </button>                
            </form>

        </main>
        </>
    )
}


export const getServerSideProps = canSSAuth(async (ctx)=>{
    return {
        props:{}
    }
})