import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginResult from './pages/LoginResult';
import UserList from './pages/UserList';
import SorterList from './pages/SorterList';
import SorterNew from './pages/SorterNew';
import SorterPage from './pages/SorterPage';

const routes = [
    {
        component: App,
        routes: [
            {
                component: Home,
                path: '/',
                exact: true
            },
            {
                component: Login,
                path: '/login/',
                exact: true
            },
            {
                component: LoginResult,
                path: '/login/result',
                exact: true
            },
            {
                component: UserList,
                path: '/users',
                exact: true
            },
            {
                component: SorterList,
                path: '/sorters',
                exact: true
            },
            {
                component: SorterNew,
                path: '/sorters/new',
                exact: true
            },
            {
                component: SorterPage,
                path: '/sorters/:id',
                exact: true
            }
        ]
    }
];

export default routes;
