import React, { createContext, useContext, useState } from 'react';

// Context 생성
const UserContext = createContext();

// UserContext Provider 설정
export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null); // userEmail 초기값은 null

    const settingEmail = (email) => {
        setUserEmail(email); // 로그인한 이메일 설정
    };

    return (
        <UserContext.Provider value={{ userEmail, settingEmail }}>
            {children}
        </UserContext.Provider>
    );
};

// useUser Hook 정의
export const useUser = () => {
    return useContext(UserContext); // useContext로 UserContext 값 가져오기
};
