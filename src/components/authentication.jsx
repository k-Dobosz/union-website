import { BehaviorSubject } from 'rxjs';
import { decode } from "jsonwebtoken";
import { Config } from "../config";

const currentUser = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const login = (email, password) => {
    return fetch(`${Config.url}user/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ 'email': email, 'password': password }) })
        .then(handleResponse)
        .then((data) => {
            let decoded = decode(data.token);
            return fetch(`${Config.url}user/${decoded.userId}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + data.token, 'Content-Type': 'application/json' } })
                .then(authentication.handleResponse)
                .then((res) => {
                    let user = {
                        'userId': decoded.userId,
                        'email': decoded.email,
                        'role': res.role,
                        'token': data.token,
                        'refresh_token': data.refresh_token
                    };
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    currentUser.next(user);
                    return user;
                });
        });
};

const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentPatient');
    localStorage.removeItem('currentInstitution');
    currentUser.next(null);
};

const handleResponse = ( response ) => {
    return response.text().then((text) => {
       const data = JSON.parse(text);
       if (!response.ok) {
           if ([401].indexOf(response.status) !== -1) {
               logout();
               window.location.reload();
           }
           const error = data.message || response.statusText;
           return Promise.reject(error);
       }

       return data;
    });
};

export const authentication = {
    login,
    logout,
    handleResponse,
    currentuser: currentUser.asObservable(),
    get currentUserValue () {return currentUser.value}
};