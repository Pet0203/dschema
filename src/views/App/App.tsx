import React, { useState } from 'react';
import Select from 'react-select';
import '../../scss/main.scss';
import styles from './App.module.scss';
import { Clipboard, Gift, Heart } from 'react-feather';

function App() {
  /**
   * @type 
   * {value: string, label: string}
   * @value
   * Is returned from the select component when a value is selected
   * @label
   * Is the text that is displayed in the select component
   * @description
   * This is the object that is the current selected value in the select component
   * @example
   * {value: 'grupp1', label: 'Grupp 1'}
   */
  const [selectedOption, setSelectedOption] = useState({ value: 'grupp1', label: 'Grupp 1' });

  /**
   * @type 
   * [{value: string, label: string}]
   * @value
   * Is returned from the select component when a value is selected
   * @label
   * Is the text that is displayed in the select component
   * @description
   * This is the array of selected options for the select component.
   * @example
   * {value: 'grupp1', label: 'Grupp 1'}
   */
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
          <h2 className={styles.title}>TB Schema | Prenumerera</h2>
          <div>
            <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Välj din TB undergrupp">Välj grupp</h4>
            <div className={styles.items}>
              <Select className={styles.react_select_container} defaultValue={selectedOption} options={options} />
            </div>
          </div>
          <div>
            <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Välj de kurser du vill inkludera i schemat">Välj kurser</h4>
            <div className={[styles.items, styles['items--checkboxes']].join(' ')}>
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
            <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip='Lägger till "Lindholmen" eller "Johanneberg" i platsfältet" '>Modifikationer</h4>
            <div className={styles.items}>
              <label htmlFor="mod1">Förbättra platsfältet</label>
              <input type="checkbox" id="mod1" name="mod1" value="mod1 "></input>
            </div>
          </div>
          <div className={styles.calendar_url}>
            <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Brukar gå att klistra in i de flesta kalender apparna">Kalender URL</h4>
            <button className={styles.calendar_url__primary_button}><Clipboard size={16} /> Kopiera kalender url</button>
            <p>OR manually copy the url</p>
            <input className={styles.calendar_url__url_input} type="text" readOnly={true} value="https://testurl.comdnuanwduanwdunauiwdniauwnduawndiuanw" />
          </div>
          <div className={styles.credits}>
            <p className={styles.credits__made_with}>Made with<Heart className={styles["credits__made_with--heart"]} size={16} />in Gothenburg, Sweden</p>
            <p>En slant för arbetet skadar aldrig!</p>
            <a className={styles.credits__paypal} href="https://paypal.me/memgod">
              <Gift size={16} />
              PayPal
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
