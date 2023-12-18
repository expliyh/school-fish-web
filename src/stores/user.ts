import {defineStore} from "pinia";
import {inject, ref} from "vue";

export const useUserStore = defineStore('user', () => {
    const role = ref("")
    const username = ref("")
    const accessToken = ref("")
    const global: any = inject("global")

    function getRole(this: any) {
        global.axios.postForm(
            global.api_base + "/get-user-info",
            {
                'access_token': localStorage.getItem("token"),
            }
        ).then((response: any) => {
            this.role = response.data.role
        }).catch((error: any) => {
                console.log(error)
            }
        )
        return this.role
    }

    function setRole(this: any, role: string) {
        this.role = role
    }

    function setUsername(this: any, username: string) {
        this.username = username
    }

    function setAccessToken(this: any, refreshToken: string) {
        this.accessToken = refreshToken
    }


    return {role, username, accessToken, setRole, setUsername, setAccessToken, getRole}
})