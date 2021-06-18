import styled from 'styled-components';
import { colors } from '../colors';

const { lightGray, darkBlue, opaqueBlue } = colors;

export const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    font-weight: 500;
`;

export const RestartButton = styled.button`
    font-size: 25px;
    margin-top: 20px;
    padding: 8px 30px;
    background: linear-gradient(${darkBlue}, ${opaqueBlue});
    color: ${lightGray};
    border-radius: 8px;
    border: 0px;
    font-family: 'Arial';
    letter-spacing: 5px;

    &:hover {
        cursor: pointer;
    }
`;

export default null;