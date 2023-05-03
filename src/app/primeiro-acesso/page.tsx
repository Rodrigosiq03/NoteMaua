'use client';
import React from 'react';

import {Container, ContainerCardContent, ContainerRow} from '../components/Container';
import {CardGray, CardWhite} from '../components/Card';
import { Title } from '../components/Title';
import { ExitIcon } from '../components/Icon';
import { FormButton, FormContainer, FormInput, FormLabel } from '../components/Form';
import { ReturnLink } from '../components/Link';
import ImageComponentMaua from '../components/ImageComponent/LogoMaua';
import ImageComponentNoteMaua from '../components/ImageComponent/LogoNoteMaua';

import { useForm, SubmitHandler } from "react-hook-form";

import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import config from '../../aws-exports';
Amplify.configure(config);

import {Hind} from 'next/font/google';
const hind = Hind({subsets: ['latin'], weight: ['700', '300']})



export interface IFormlogin {
    email: string;
    password: string;
}

export default function PrimeiroAcessoPage() {
  const {register, handleSubmit, formState: { errors } } = useForm<IFormlogin>();
  
  const onSubmit: SubmitHandler<IFormlogin> = data => {
    const auth = Auth.signIn(data.email, process.env.NEXT_PUBLIC_PASSWORD_HARD_CODED);
    if (auth) {
      auth.then((res) => {
        console.log('RES ', res.challengeName);
        if (res.challengeName === 'NEW_PASSWORD_REQUIRED') {
          Auth.completeNewPassword(
            res, 'Teste123!'
          ).then((res) => {
            Auth.forgotPassword(data.email).then((res) => {
              console.log('RES ', res);
            }).catch((err) => {
              console.log('ERR ', err);
            });
            console.log(res)
          }).catch((err) => {
            console.log('ERR ', err);
          }
          );
        }
        Auth.currentAuthenticatedUser().then((res) => {
          console.log('RES ', res);
        }) 
      });
    } else {
      console.log('ERROR LOGGED IN ', auth)
    }
  };

  return (
    <Container className={hind.className}>
      <CardGray>
        <CardWhite>
            <ContainerCardContent>
              <ImageComponentNoteMaua/>
              <Title style={{ marginBottom: '32px' }}>Realize seu cadastro</Title>
              <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <FormLabel htmlFor='email'>Digite seu E-mail (@maua.br)</FormLabel>
                <FormInput type='email' {...register('email', { required: true, })}/>
                {errors.email && <span style={{color: 'red'}}>Este campo é obrigatório</span> } 
                <FormLabel style={{paddingRight: ''}} htmlFor='password'>Digite uma senha</FormLabel>
                <FormInput type='password' {...register('password', { required: true})} />
                <FormButton type='submit'>Cadastrar</FormButton>
              </FormContainer>
              <ContainerRow>
                <ReturnLink href="/">Voltar</ReturnLink>
                <ExitIcon /> 
              </ContainerRow>
            </ContainerCardContent>
        </CardWhite>
      </CardGray>
        <ImageComponentMaua />
    </Container> 
  )
}