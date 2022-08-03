import React, { useState } from 'react';
import Select from 'react-select';
import '../../scss/main.scss';
import styles from './App.module.scss';

function App() {
  const [selectedOption, setSelectedOption] = useState({ value: 'grupp1', label: 'Grupp 1' });

  const options = [
    { value: 'grupp1', label: 'Grupp 1' },
    { value: 'grupp2', label: 'Grupp 2' },
    { value: 'grupp3', label: 'Grupp 3' },
    { value: 'grupp4', label: 'Grupp 4' },
    { value: 'grupp5', label: 'Grupp 5' },
    { value: 'grupp6', label: 'Grupp 6' },
    { value: 'grupp7', label: 'Grupp 7' },
    { value: 'grupp8', label: 'Grupp 8' },
    { value: 'grupp9', label: 'Grupp 9' },
    { value: 'grupp10', label: 'Grupp 10' },
  ];

  return (
    <div className={styles.app}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>TB Schema | Prenumerera</h3>
          <div>
            <h4 className={styles.subtitle}>Välj grupp</h4>
            <div className={styles.items}>
              <Select className={styles.react_select_container} defaultValue={selectedOption} options={options} />
            </div>
          </div>
          <div>
            <h4 className={styles.subtitle}>Välj kurser</h4>
            <div className={[styles.items, styles["items--checkboxes"]].join(' ')}>
              <div>
                <label htmlFor="math">Matematik</label>
                <input type="checkbox" id="math" name="math" value="Matematik"></input>
              </div>
              <div>
                <label htmlFor="chemistry">Kemi</label>
                <input type="checkbox" id="chemistry" name="chemistry" value="Kemi"></input>
              </div>
              <div>
                <label htmlFor="physics">Fysik</label>
                <input type="checkbox" id="physics" name="physics" value="Fysik"></input>
              </div>
            </div>
          </div>
          <div>
            <h4 className={styles.subtitle}>Modifikationer</h4>
            <div className={styles.items}>
              <label htmlFor="mod1">Förbättra platsfältet</label>
              <input type="checkbox" id="mod1" name="mod1" value="mod1 "></input>
            </div>
          </div>
          <div className={styles.calendar_url}>
            <h4 className={styles.subtitle}>Kalender URL</h4>
            <button className={styles.calendar_url__primary_button}>Kopiera kalender url</button>
            <p>OR manually copy the url</p>
            <input className={styles.calendar_url__url_input} type="text" readOnly={true} value="https://testurl.comdnuanwduanwdunauiwdniauwnduawndiuanw" />
          </div>
          {/* <p>
            Går det inte att prenumera via url?
            <br />
            Ladda ner .ical och importera den till din kalender.
          </p>
          <button>Ladda ner .ical</button> */}

          <div className={styles.credits}>
            <p>Made with ❤ in Gothenburg, Sweden</p>
            <p>En slant för arbetet skadar aldrig!</p>
            <a href="https://paypal.me/memgod">PayPal</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
