const config = useRuntimeConfig();
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export const postApi = async (url, data) => {
    var raw = JSON.stringify(data);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };

    try {
        const response = await fetch(
            `${config.public.apiUrl}${url}`,
            requestOptions
        );
        return await response.json();
    } catch (error) {
        return error;
    }
};

export const imageUpload = async (url, images) => {
    var requestOptions = {
        method: "POST",
        body: images,
    };

    try {
        const response = await fetch(
            `${config.public.apiUrl}${url}`,
            requestOptions
        );
        return await response.json();
    } catch (error) {
        return error;
    }
};

export const getApi = async (url) => {
    try {
        const response = await fetch(`${config.public.apiUrl}${url}`);
        return await response.json();
    } catch (error) {
        return error;
    }
};

export const deleteApi = async (url, data) => {
    var raw = JSON.stringify(data);

    var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
    };

    try {
        const response = await fetch(
            `${config.public.apiUrl}${url}`,
            requestOptions
        );
        return await response.json();
    } catch (error) {
        return error;
    }
};
export const listRooms = async (data) => {
    var raw = JSON.stringify(data);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };

    try {
        const response = await fetch(
            `${config.public.apiUrl}/bk/room/ListData`,
            requestOptions
        );
        const result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
};

export const genID = () => {
    return Math.random().toString(16).slice(2);
};