import { EnumErrorType, IError } from "@/abstracts/error-types";

export const checkOutError = (err: string) => {
    console.error(err);
    if (err) {
        return JSON.parse(err);
    }
    return null
}

export const listHtmlAlert = (errors: IError | IError[]) => {
    let html = `<ul class="alerts">`;

    const getClass = (key: EnumErrorType) => {
        console.info("key", key);
        switch (key) {
            case EnumErrorType.Error: return 'error';
            case EnumErrorType.Warning: return 'warning';
            case EnumErrorType.Info: return 'info';
            default: return 'error';
        }
    };

    if (Array.isArray(errors)) {
        errors.forEach((err: IError) => {
            html += `
            <li class="${getClass(err.key)}">
                <h4>${err.title}</h4>
                <div>${err.description}</div>
            </li>
            `;
        });
    } else {
        html += `
        <li class="${getClass(errors.key)}">
            <h4>${errors.title}</h4>
            <div>${errors.description}</div>
        </li>
        `;
    }

    html += `</ul>`;
    return html;
};