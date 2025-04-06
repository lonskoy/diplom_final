import { configureStore, createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

// Начальное состояние для ролей
const initialRolesState = {
    client: false,
    admin: false,
    manager: false,
};

// Начальное состояние для бронирования по датам
const initialReservData = {
    dateStart: '',
    dateEnd: ''
}

// Создание слайса для бронирования по датам
const reservDataSlice = createSlice({
    name: 'reservData',
    initialState: initialReservData,
    reducers: {
        setReservData: (state, action) => {
            state.dateStart = action.payload.dateStart,
            state.dateEnd = action.payload.dateEnd
        },
        cleanReservData: (state) => {
            state.dateStart = '';
            state.dateEnd = '';
        }
    }
});

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
    userToken: Cookies.get('token')

};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setAuth: (state, action) => {
            state.isLoggedIn = true;
            state.userName = action.payload.userName; // Устанавливаем имя пользователя
            state.userToken = action.payload.userToken;
            Cookies.set('access_token', action.payload.accessToken);
            Cookies.set('name', action.payload.userName);
            Cookies.set('token', action.payload.userToken);
        },
        clearAuth: (state) => {
            state.isLoggedIn = false;
            state.userName = ''; // Очищаем имя пользователя
            state.userToken = ''
            Cookies.remove('access_token');
            Cookies.remove('name');
            Cookies.remove('token');
        },
    },
});

// Экспортируем действия для ролей
export const { setClient, setAdmin, setManager  } = rolesSlice.actions;
// Экспортируем действия для авторизации
export const { setAuth, clearAuth } = authSlice.actions;
// Экспортируем действия для бронирования по датам
export const { setReservData } = reservDataSlice.actions;

// Создаем хранилище с несколькими слайсами
export const store = configureStore({
    reducer: {
        roles: rolesSlice.reducer,
        auth: authSlice.reducer, // Добавляем слайс auth
        reservData: reservDataSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;