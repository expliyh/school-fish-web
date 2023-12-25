import {defineStore} from "pinia";
import {inject, ref} from "vue";

export const usePrefillStore = defineStore('prefill', () => {
    const item_id = ref("")
    const item_name = ref("")
    const ticket_id = ref("")

    function setItemId(this: any, item_id: string | null) {
        if (item_id === null) {
            this.item_id = ""
        } else {
            this.item_id = item_id
        }
    }

    function getItemId(this: any) {
        return this.item_id
    }

    function setItemName(this: any, item_name: string | null) {
        if (item_name === null) {
            this.item_name = ""
        } else {
            this.item_name = item_name
        }
    }

    function setTicketId(this: any, ticket_id: string | null) {
        if (ticket_id === null) {
            this.ticket_id = ""
        } else {
            this.ticket_id = ticket_id
        }
    }

    function getTicketId(this: any) {
        return this.ticket_id
    }

    function reset(this: any) {
        this.item_id = ""
        this.item_name = ""
        this.ticket_id = ""
    }

    function clear(this: any) {
        this.reset()
    }

    return {item_id, item_name, ticket_id, setItemId, getItemId, setItemName, setTicketId, getTicketId, reset, clear}
})