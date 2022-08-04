import React, { useState } from 'react';
import Select from 'react-select';
import '../../scss/main.scss';
import styles from './App.module.scss';
import { Clipboard, Gift, Heart } from 'react-feather';

interface IGroups {
  value: string;
  label: string;
}

interface ICourses {
  value: string;
  label: string;
}

function App() {
  const [selectedGroup, setSelectedGroup] = useState<IGroups>();
  const [selectedCourses, setSelectedCourses] = useState<ICourses[]>();

  const groups: IGroups[] = [
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

  const courses = [
    { value: 'matte', label: 'Matte' },
    { value: 'fysik', label: 'Fysik' },
    { value: 'kemi', label: 'Kemi' },
    { value: 'proFys', label: 'Projektkurs Fysik' },
    { value: 'proKem', label: 'Projektkurs Kemi' },
    { value: 'programmering', label: 'Programmering' },
  ];

  const handleGroupChange = (selected?: IGroups | IGroups[] | null) => {
    setSelectedGroup(selected as IGroups);
  };

  const handleCoursesChange = (selected: readonly ICourses[]) => {
    setSelectedCourses(selected as ICourses[]);
  };

  return (
    <div className={styles.app}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>TB Schema | Prenumerera</h2>
          <div>
            <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Välj din TB undergrupp">
              Välj grupp
            </h4>
            <div className={styles.items}>
              <Select className={styles.react_select_container} placeholder="Välj undergrupp" defaultValue={selectedGroup} onChange={handleGroupChange} options={groups} />
            </div>
          </div>
          {selectedGroup && selectedGroup.value && (
            <>
              <div>
                <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Välj de kurser du vill inkludera i schemat">
                  Välj kurser
                </h4>
                <div className={styles.items}>
                  <Select className={styles.react_select_container} isMulti closeMenuOnSelect={false} defaultValue={selectedCourses} onChange={handleCoursesChange} options={courses} />
                </div>
              </div>
              <div>
                <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip='Lägger till "Lindholmen" eller "Johanneberg" i platsfältet" '>
                  Modifikationer
                </h4>
                <div className={styles.items}>
                  <label className={styles.checkbox}>
                    Förbättra platsfältet
                    <input name="mod1" type="checkbox"></input>
                    <span className={styles.checkbox__checkmark}></span>
                  </label>
                </div>
              </div>
              {selectedCourses && selectedCourses.length !== 0 && (
                <div className={styles.calendar_url}>
                  <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Brukar gå att klistra in i de flesta kalender apparna">
                    Kalender URL
                  </h4>
                  <div className={[styles.items, styles['items--calendar_url']].join(' ')}>
                    <button className={styles.calendar_url__primary_button}>
                      <Clipboard size={16} /> Kopiera kalender url
                    </button>
                    <p>OR manually copy the url</p>
                    <input className={styles.calendar_url__url_input} type="text" readOnly={true} value="https://testurl.comdnuanwduanwdunauiwdniauwnduawndiuanw" />
                  </div>
                </div>
              )}
            </>
          )}
          <div className={styles.credits}>
            <p className={styles.credits__made_with}>
              Made with
              <Heart className={styles['credits__made_with--heart']} size={16} />
              in Gothenburg, Sweden
            </p>
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
