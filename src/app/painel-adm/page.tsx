'use client';

import { CardADM, CardGrayADM, CardWhiteADM } from '../../components/Card';
import {
  Container,
  ContainerRowADM,
  ContainerRowADM2,
} from '../../components/Container';
import {
  FormButtonADM,
  FormButtonSearch,
  FormContainer,
  FormContainerADM,
  FormInput,
  FormSelect,
} from '../../components/Form';
import ImageComponentMaua from '../../components/ImageComponent/LogoMaua';
import ImageComponentNoteMaua from '../../components/ImageComponent/LogoNoteMaua';

import { Hind } from 'next/font/google';
import {
  CircleIconGreen,
  CircleIconRed,
  PersonIconADM,
  SearchIcon,
} from '../../components/Icon';
import { TitleADM } from '../../components/Title';
import {
  ListItemLeft,
  ListItemRight,
  ListNumSerie,
} from '../../components/List';
const hind = Hind({ subsets: ['latin'], weight: ['700', '300'] });
import { SubmitHandler, useForm } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';
import DialogComponentDevolution from '../../components/DialogMUI/DialogDevolution';
import DialogComponentChangeEmail from '../../components/DialogMUI/DialogChangeEmailADM';
import { DialogText } from '@/components/Dialog';
import { IconButton } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import { NotebookContext } from '@/contexts/notebook_provider';
import { WithdrawContext } from '@/contexts/withdraw_provider';
import { Notebook } from '@/@clean/shared/domain/entities/notebook';
import { Withdraw } from '@/@clean/shared/domain/entities/withdraw';

export interface IFormDevolution {
  numSerie: string;
}

export default async function PainelAdmPage() {
  const { handleSubmit, setError, register, formState: { errors } } = useForm<IFormDevolution>();
  const router = useRouter();
  const { validateNumSerieInJson } = useContext(NotebookContext);

  const [openDialogDevolution,  setOpenDialogDevolution] = React.useState(false);
  const [openDialogChangeEmail, setOpenDialogChangeEmail] =
    React.useState(false);
    

  const handleClickOpenDialogDevolution = () => {
    setOpenDialogDevolution(true);
  };
  const handleCloseDialogDevolution = () => {
    setOpenDialogDevolution(false);
  };

  const handleClickOpenDialogChangeEmail = () => {
    setOpenDialogChangeEmail(true);
  };

  const handleCloseDialogChangeEmail = () => {
    setOpenDialogChangeEmail(false);
  };

  const { getAllNotebooks} = useContext(WithdrawContext);
  const [notebooks, setNotebooks] = useState<[Notebook, Withdraw[]][]>([]);


  const onSubmitDevolution: SubmitHandler<IFormDevolution> = async (data) => {
    if (!validateNumSerieInJson(data.numSerie))
      setError('numSerie', {
        type: 'manual',
        message: 'Notebook não encontrado',
      });
    console.log(data);
    setValueDialogDevolution(data.numSerie);
    handleClickOpenDialogDevolution();
  };

  const [valueDialogDevolution, setValueDialogDevolution] = React.useState('');
  useEffect(() => {
    console.log('Entrou no useEffect');
    const response = Auth.currentAuthenticatedUser();
    response
      .then((user) => {
        const customAttributes = user.attributes['custom:role'];
        if (customAttributes === 'STUDENT') {
          router.push('/');
        }
        if (customAttributes === 'EMPLOYEE') {
          return;
        }
      })
      .catch((error) => {
        router.push('/');
      });
      getIdToken().then((idToken) => {
        getAllNotebooks(idToken).then((response) => {
          console.log('Resposta do getAllNotebooks: ', response);
          setNotebooks(response);
        }
        );
      });
      }, []);

    async function getIdToken() {
      var idToken = await Auth.currentSession().then((response) => {
        return response.getIdToken().getJwtToken();
      }).catch((error) => {
        console.log(error);
        return '';
      });
      return idToken;
    }

  return (
    <Container className={hind.className}>
      <ImageComponentNoteMaua />
      <CardGrayADM>
        <CardWhiteADM>
          <FormContainer onSubmit={handleSubmit(onSubmitDevolution)}>
            <ContainerRowADM>
                <FormInput
                  disableUnderline={true}
                  placeholder="Número de série"
                  {...register('numSerie', {
                    required: true,
                    maxLength: 5,
                    minLength: 5,
                  })}
                ></FormInput>
                
                <FormButtonADM type="submit">Confirmar devolução</FormButtonADM>
                <IconButton
                  sx={{ marginLeft: '612px' }}
                  onClick={handleClickOpenDialogChangeEmail}
                >
                  <PersonIconADM />
                </IconButton>
            </ContainerRowADM>
            {errors.numSerie?.type === 'required' && (
                  <span style={{ color: 'red', textAlign: 'center' }}>
                  Este campo é um campo obrigatório
                </span>
                
              )}
              {errors.numSerie?.type === 'minLength' && (
                <span
                  style={{
                    color: 'red',
                    textAlign: 'center',
                  }}
                >
                  Número de série inválido
                </span>
              )}
            <CardADM>
              <hr
                style={{
                  marginLeft: '20px',
                  marginRight: '20px',
                  borderColor: 'd6d6d6',
                }}
              />
              <ContainerRowADM2>
                <FormInput
                  disableUnderline={true}
                  placeholder="Pesquisar"
                  style={{
                    marginLeft: '20px',
                    width: '160px',
                    height: '30px',
                    marginBottom: '15px',
                  }}
                ></FormInput>
                <FormSelect>
                  <option>RA</option>
                  <option>Número de série</option>
                </FormSelect>
                <FormButtonSearch type="submit">
                  <SearchIcon />
                </FormButtonSearch>
              </ContainerRowADM2>
              <TitleADM style={{ paddingLeft: '50px' }}>
                Número de Série
              </TitleADM>
              <TitleADM style={{ paddingLeft: '270px' }}>Estado</TitleADM>
              <TitleADM>Horário de Retirada</TitleADM>
              <TitleADM style={{ paddingLeft: '226px' }}>RA do Aluno</TitleADM>
              <TitleADM style={{ paddingLeft: '305px' }}>
                Nome do Aluno
              </TitleADM>
              <hr
                style={{
                  marginLeft: '20px',
                  marginRight: '20px',
                  borderColor: 'd6d6d6',
                  marginTop: '0px',
                }}
              />
              <ListNumSerie>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>34059</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconGreen />
                      <div style={{ paddingLeft: '4px' }}>Ativo</div>
                    </div>
                    <div>7:40</div>
                    <div>22.01049-0</div>
                    <div>Vitor Moretti Negresiolo</div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconGreen />
                      <div style={{ paddingLeft: '4px' }}>Ativo</div>
                    </div>
                    <div>9:00</div>
                    <div>22.01049-0</div>
                    <div>Vitor Moretti Negresiolo</div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <ListItemLeft>38029</ListItemLeft>
                  <ListItemRight>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <CircleIconRed />
                      <div style={{ paddingLeft: '4px' }}>Inativo</div>
                    </div>
                  </ListItemRight>
                </div>
              </ListNumSerie>
            </CardADM>
          </FormContainer>
        </CardWhiteADM>
      </CardGrayADM>
      <ImageComponentMaua style={{ paddingTop: '18px' }} />
      <DialogComponentDevolution
        open={openDialogDevolution}
        value={valueDialogDevolution}
        handleClose={handleCloseDialogDevolution}
      >
        <div>
          <hr></hr>
          <DialogText style={{ fontWeight: '700', fontSize: '25px' }}>
            Número de Série: {valueDialogDevolution}
          </DialogText>
          <DialogText>
            Horário de Retirada: <strong>7:40</strong>
          </DialogText>
          <DialogText>
            Horário de Devolução: <strong>11:20</strong>
          </DialogText>
          <hr style={{ marginTop: '25px' }}></hr>
          <DialogText style={{ fontWeight: '700', fontSize: '25px' }}>
            Luigi Guimarães Trevisan
          </DialogText>
          <DialogText>22.01102-0@maua.br</DialogText>
          <DialogText>
            RA:<strong> 22.01102-0</strong>
          </DialogText>
        </div>
      </DialogComponentDevolution>
      <DialogComponentChangeEmail
        open={openDialogChangeEmail}
        handleClose={handleCloseDialogChangeEmail}
      />
    </Container>
  );
}
