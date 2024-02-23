export const formatDate = (date) => {
    const utc = new Date(date).setHours(new Date(date).getHours() - 3)
    var d = new Date(utc),
        month = "" + (d.getMonth() + 1),
        day = "" + (d.getDate() + 1),
        year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
};

export const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return "";
    return isoDateString.split('T')[0];
};

export const limitNameString = (string) => {
    if (string.length > 25) {
        return string.substring(0, 30) + "...";
    } else {
        return string;
    }
};

export const limitDescriptionString = (string) => {
    if (string.length > 40) {
        return string.substring(0, 40) + "...";
    } else {
        return string;
    }
};

export const getChangedFields = (original, updated) => {
    const changes = {};

    const findChanges = (originalObj, updatedObj, prefix = "") => {
        Object.keys(updatedObj).forEach((key) => {
            const fullPath = prefix ? `${prefix}.${key}` : key;

            if (
                updatedObj[key] instanceof Object &&
                !(updatedObj[key] instanceof Array)
            ) {
                if (!originalObj[key]) {
                    changes[fullPath] = updatedObj[key];
                } else {
                    findChanges(
                        originalObj[key],
                        updatedObj[key],
                        fullPath
                    );
                }
            } else {
                if (
                    !originalObj.hasOwnProperty(key) ||
                    originalObj[key] !== updatedObj[key]
                ) {
                    changes[fullPath] = updatedObj[key];
                }
            }
        });
    };

    findChanges(original, updated);
    return changes;
};
