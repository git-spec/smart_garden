
export const checkHubNumPost = num => {
    return new Promise((resolve, reject) => {
        fetch('/checkhubnum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({num})
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};
