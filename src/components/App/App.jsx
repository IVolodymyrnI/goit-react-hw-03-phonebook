import { nanoid } from 'nanoid';
import { Component } from 'react';
import InitialContacts from 'components/data/contacts';
import { ContactForm } from 'components/Phonebook/ContactForm/ContactForm';
import { PhoneNumberList } from 'components/Phonebook/PhoneNumberList/PhoneNumberList';
import { FilterByName } from 'components/Phonebook/FilterByName/FilterByName';
import { Title, SubTitle, AppStyle } from './AppStyle';
import { load, save } from 'components/utils';

const contactsAsKey = 'contacts';

export class App extends Component {
  state = {
    contacts: InitialContacts,
    filter: '',
  };

  onAddContactBtn = value => {
    const isContactExist = this.checkOnUniqueName(value);
    const valueWithId = Object.assign(value, { id: nanoid() });

    isContactExist
      ? this.setContactToState(valueWithId)
      : alert(`${value.name} is already in contacts.`);
  };

  onFilterName = value => {
    this.setState({ filter: value });
  };

  onDeleteBtn = id => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
  };

  setContactToState = value => {
    this.setState(prevState => ({
      contacts: Array.isArray(value)
        ? Array.from(value)
        : [value, ...prevState.contacts],
    }));
  };

  checkOnUniqueName = value => {
    const { contacts } = this.state;
    const arrayOfNames = contacts.map(contact => contact.name.toLowerCase());
    const index = arrayOfNames.indexOf(value.name.toLowerCase());

    return index === -1;
  };

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      save(contactsAsKey, contacts);
    }
  }

  componentDidMount() {
    const contacts = load(contactsAsKey);
    if (contacts) {
      this.setContactToState(contacts);
    }
  }

  render() {
    const { contacts, filter } = this.state;
    const normaliziedName = filter.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(normaliziedName)
    );

    return (
      <AppStyle>
        {console.log()}
        <Title>PhoneBook</Title>
        <ContactForm onAddContactBtn={this.onAddContactBtn} />
        <SubTitle>Contacts</SubTitle>
        <FilterByName onFilterName={this.onFilterName} value={filter} />
        <PhoneNumberList
          contacts={filteredContacts}
          onDeleteBtn={this.onDeleteBtn}
        />
      </AppStyle>
    );
  }
}
