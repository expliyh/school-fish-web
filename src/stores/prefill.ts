import {defineStore} from "pinia";
import {inject, reactive, ref} from "vue";

export const usePrefillStore = defineStore('prefill', () => {
    const item_id = ref("")
    const item_name = ref("")
    const ticket_id = ref("")
    const filter = reactive({
        name_key: '',
        id: '',
        by: ''
    })

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
        this.filter.name_key = ""
        this.filter.id = ""
        this.filter.by = ""
    }


    function clear(this: any) {
        this.reset()
    }

    return {
        filter,
        item_id,
        item_name,
        ticket_id,
        setItemId,
        getItemId,
        setItemName,
        setTicketId,
        getTicketId,
        reset,
        clear
    }
})