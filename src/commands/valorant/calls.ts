import axios from 'axios';

const API_BASE_URL = new URL('https://api.henrikdev.xyz/valorant/v1/');

export type UserDataResponse = {
    status: number;
    message?: string;
    data?: {
        puuid: string;
        region: string;
        account_level: number;
        name: string;
        tag: string;
        card: {
            small: string;
            large: string;
            wide: string;
            id: string;
        },
        last_update: string;
    }
};

export type MMRDataResponse = {
    status: number;
    message?: string;
    data?: {
        currenttier: number;
        currenttierpatched: string;
        ranking_in_tier: number;
        mmr_change_to_last_game: number;
        elo: number;
        name: string;
        tag: string;
    }
}

export async function getValorantUserData(usernameWithTag: string): Promise<UserDataResponse> {
    const [username, tag] = usernameWithTag.split('#');
    const userData = (await axios.get(`${API_BASE_URL.href}account/${username}/${tag}`)).data;
    return userData as UserDataResponse;
}

export async function getValorantMMRData(username: string,
                                         tag: string,
                                         region: string): Promise<MMRDataResponse> {

    const mmrData = (await axios.get(`${API_BASE_URL.href}mmr/${region}/${username}/${tag}`)).data;
    return mmrData as MMRDataResponse;
}
