export class User {
    aud: string[];
    auth_time: number;
    iat: number;
    iss: string;
    nombre: string;
    privileges: {
        preprod: string[];
        reportesadministrativos: string[];
    };
    rat: number;
    sub: string;
    tienda: string;
    tiendaNombre: string;
    tiendaTipo: string;
}