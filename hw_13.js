"use strict"

const user = {

    name: 'Olya',
    email: "olya@gmail.com",
    address: "Grodno",
    phone: 375298654125,
    id: 1
}

const user1 = {

    name: 'Lena',
    email: "lena@gmail.com",
    address: "Mogilev",
    phone: 375297854295,
    id: 2
}


class Contact {
    constructor(contact) {
        this.data = contact
    }

    editContact(newContact) {
        this.data = newContact
    }

    getContact() {
        return this.data
    }
}


const contact = new Contact(user)
// console.log(contact)
// contact.editContact(user1)
// console.log(contact.getContact())

class Contacts {
    constructor() {
        this.data = []
    }
    add(contact) {
        const newContact = new Contact(contact)
        this.data = [...this.data, newContact.data]
    }

    edit(name, data) {
        const contacts = this.data.map(element => {
            if (element.name === name) {
                return { ...element, ...data }
            }
            return element
        })

        // console.log(contacts);

        contact.editContact.call(this, contacts)
    }

    remove(name) {
        return this.data = this.data.filter(element => element.name !== name)
    }

    get() {
        return this.data
    }


}

const contacts = new Contacts()

// console.log(contacts)
// contacts.add(user)
// contacts.add(user1)
// contacts.edit('Olya', { address: "Brest" })
// contacts.edit('Lena', { email: 'oooo@gmail.com' })
// console.log(contacts)
// contacts.remove('Olya')
// console.log(contacts.get())

class ContactsApp extends Contacts {
    constructor() {
        super();
        this.render()
    }
    render() {
        const form = document.querySelector('.form')
        // console.log(form)
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const { elements } = form // достаем элементы деструктуризацией
            // console.log(elements);
            const contact = {}

            //превращаем псевдомассив в массив

            Array.from(elements)
                .filter(element => element.name) //убрали данные с кнопки
                .forEach(element => {
                    const { name, value } = element // деструктуризацией
                    contact[name] = value

                    element.value = ''
                })

            super.add(contact)
            this.createContactList()
            this.handleLocalStorage()

        })

        // createContactList = new ContactsList()
        // console.log(contactsApp)

        
    }

    setCookie(name, value) {
        let exp = new Date()
        exp.setDate(exp.getDate() + 10)
        document.cookie = `${name}=${value}; path=/; expires= ${exp}`
    }

    deleteCookie(name) {
        setCookie(name, "", {
            'max-age': -1
        })
    }
//Добаление данных в Local Storage
    handleLocalStorage(){
        if (!this.data.length){
            return localStorage.removeItem('contacts')
        }
        localStorage.setItem("contacts", JSON.stringify(this.data))

        
        this.setCookie('storage', 'true')
    }
// запрос к серверу
    getData () {
        if(!localStorage.getItem('contacts')) {
            fetch('https://jsonplaceholder.typicode.com/users')
                .then(responce => responce.json())
                .then(data => {
                    this.data = [...this.data, ...data]
                    this.handleLocalStorage();
                })
        }
    }


    createContactList() {
        const contacts = document.querySelector(".contacts__list")
        const list = document.createElement('div')
        list.className = "contact__item"
        const name = document.createElement("div")
        const email = document.createElement("div")
        const address = document.createElement("div")
        const phone = document.createElement("div")

        const buttonContainer = document.createElement('button')
        buttonContainer.className = "buttonContainer"

        //кнопка редактирования
        const editButton = document.createElement('button')
        editButton.classList.add('contact__button', "button")
        editButton.innerHTML = "Edite"

        // кнопка удаления
        const removeButton = document.createElement('button')
        removeButton.classList.add('contact__button', "button")
        removeButton.innerHTML = "Remove"

        buttonContainer.append(editButton, removeButton)

        list.append(name, email, address, phone, buttonContainer)
        contacts.append(list)
         // 
        editButton.addEventListener('click', event => {
            event.preventDefault()
            const { target } = event

            const parent = removeButton.closest(".contacts__item")
            const editContact = {}
            name.innerHTML = editContact.name =
                prompt("Enter name:") || name.textContent
            email.innerHTML = editContact.email =
                prompt("Enter email:") || email.textContent
            address.innerHTML = editContact.address =
                prompt("Enter address:") || address.textContent
            phone.innerHTML = editContact.phone =
                prompt("Enter phone:") || phone.textContent

            super.edit(+parent.name, editContact)          
           
        })
        this.handleLocalStorage()

        removeButton.addEventListener("click", (event) => {
            event.preventDefault()
            const parent = removeButton.parentElement.parentElement
            super.remove(+parent.name)
            parent.remove()
            this.handleLocalStorage()

        })
        this.data.find((element) => {
            name.innerHTML = element.name
            email.innerHTML = element.email
            address.innerHTML = element.address
            phone.innerHTML = element.phone

        })

    }
}

const contactsApp = new ContactsApp()

console.log(contactsApp)