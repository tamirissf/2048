import styled from 'styled-components';

export const Wrapper = styled.div`
    background-color: ${props => props.blockColor};
    border: solid 2px #a3d00c;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b9b9b9;
    font-size: xx-large;
    font-weight: 600;
    box-sizing: border-box;
    position: absolute;
    top: ${props => props.row * 125 + 'px'};
    left: ${props => props.column * 125 + 'px'};
    width: 125px;
    height: 125px;
    transition: 150ms;
`;

export default null;