import { configureStore, createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

// Начальное состояние для ролей
const initialRolesState = {
    client: false,
    admin: false,
    manager: false,
};

// Создание слайса для ролей
const rolesSlice = createSlice({
    name: 'roles',
    initialState: initialRolesState,
    reducers: {
        setClient: (state, action) => {
            state.client = action.payload;
        },
        setAdmin: (state, action) => {
            state.admin = action.payload;
        },
        setManager: (state, action) => {
            state.manager = action.payload;
        },
    },
});

// Начальное состояние для авторизации
const initialAuthState = {
    isLoggedIn: !!Cookies.get('access_token'),
    userName: Cookies.get('name') || '', // Добавляем userName в состояние
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setAuth: (state, action) => {
            state.isLoggedIn = true;
            state.userName = action.payload.userName; // Устанавливаем имя пользователя
            Cookies.set('access_token', action.payload.accessToken);
            Cookies.set('name', action.payload.userName);
        },
        clearAuth: (state) => {
            state.isLoggedIn = false;
            state.userName = ''; // Очищаем имя пользователя
            Cookies.remove('access_token');
            Cookies.remove('name');
        },
    },
});

// Экспортируем действия для ролей
export const { setClient, setAdmin, setManager } = rolesSlice.actions;
// Экспортируем действия для авторизации
export const { setAuth, clearAuth } = authSlice.actions;

// Создаем хранилище с несколькими слайсами
export const store = configureStore({
    reducer: {
        roles: rolesSlice.reducer,
        auth: authSlice.reducer, // Добавляем слайс auth
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;