import axios from 'axios';

const SHOWDOWN_BASE_URL = new URL('https://pokemonshowdown.com');

export type Rating = {
    elo: string;
    gxe: string;
    rpr: string;
    rprd: string;
}

export type User = {
    username: string;
    userid: string;
    registertime: number;
    group: number;
    ratings: { [key: string]: Rating; };
}

export async function fetchUserData(userid: string): Promise<User> {
    return (await axios.get(`${SHOWDOWN_BASE_URL}/users/${userid}.json`)).data;
}
