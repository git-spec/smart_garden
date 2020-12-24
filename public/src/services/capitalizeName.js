export const capitalizeName = name => {
    if (name.search(' ') > -1) {
        let newName = '';
        let arr = name.trim().split(' ');
        for (let i = 0; i < arr.length; i++) {
            newName += arr[i].charAt(0).toUpperCase() + arr[i].slice(1) + ' ';   
        }
        return newName;
    } else {
        return name.trim().charAt(0).toUpperCase() + name.slice(1);
    }
};