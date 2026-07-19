'use server'


type LoginState = {
    success: Boolean,
    statusCode: number,
    message: string,
    data: {
        accessToken: string,
        refreshToken: string
    }
}
export const loginAction = async (prevState: LoginState, formData: FormData) => {
    const email = formData.get("email")
    const password = formData.get("password")
    const payload = {
        // email: email,
        // password: password
        email, password
    }
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    const result = await res.json()
    return result

}