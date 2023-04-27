import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #B2DAFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ContainerCardContent = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 16px;
    
`;

const ContainerRowLink = styled.div`
    display: flex;
    flex-direction: row;  
    padding-top: 8px;
`;

export { Container, ContainerCardContent, ContainerRowLink };