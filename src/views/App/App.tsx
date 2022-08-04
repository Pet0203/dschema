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
  const [checkedLocation, setCheckedLocation] = useState<boolean>(false);
  const [checkedExam, setCheckedExam] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>();

  const groups: IGroups[] = [
    { value: 'ZBASS-1.1', label: 'Grupp 1' },
    { value: 'ZBASS-1.2', label: 'Grupp 2' },
    { value: 'ZBASS-1.3', label: 'Grupp 3' },
    { value: 'ZBASS-1.4', label: 'Grupp 4' },
    { value: 'ZBASS-1.5', label: 'Grupp 5' },
    { value: 'ZBASS-1.6', label: 'Grupp 6' },
    { value: 'ZBASS-1.7', label: 'Grupp 7' },
    { value: 'ZBASS-1.8', label: 'Grupp 8' },
    { value: 'ZBASS-1.9', label: 'Grupp 9' },
    { value: 'ZBASS-1.10', label: 'Grupp 10' },
  ];

  const courses = [
    { value: 'matte', label: 'Matte' },
    { value: 'fysik', label: 'Fysik' },
    { value: 'kemi', label: 'Kemi' },
    { value: 'projektkurs_fysik', label: 'Projektkurs Fysik' },
    { value: 'projektkurs_kemi', label: 'Projektkurs Kemi' },
    { value: 'programmering', label: 'Programmering' },
  ];

  const handleGroupChange = (selected?: IGroups | IGroups[] | null) => {
    setSelectedGroup(selected as IGroups);
    getDownloadLink(selected as IGroups, selectedCourses as ICourses[], checkedLocation as boolean, checkedExam as boolean);
  };

  const handleCoursesChange = (selected: readonly ICourses[]) => {
    setSelectedCourses(selected as ICourses[]);
    getDownloadLink(selectedGroup as IGroups, selected as ICourses[], checkedLocation as boolean, checkedExam as boolean);
  };

  const handleLocationChecked = (checked: boolean) => {
    setCheckedLocation(checked);
    getDownloadLink(selectedGroup as IGroups, selectedCourses as ICourses[], checked as boolean, checkedExam as boolean);
  };

  const handleExamsChecked = (checked: boolean) => {
    setCheckedExam(checked);
    getDownloadLink(selectedGroup as IGroups, selectedCourses as ICourses[], checkedLocation as boolean, checked as boolean);
  };

  async function getDownloadLink(group: IGroups, courses: ICourses[], location: boolean, exam: boolean) {
    if (group && courses && courses.length > 0) {
      const request = {
        group: group.value,
        modLocation: location,
        modExam: exam,
        courses: courses.map((course: ICourses) => course.value),
      };

      setUrlInput('https://tbschema.panivia.com/api/getUrl?' + JSON.stringify(request));

      // let url = `https://tbschema.panivia.com/api/getUrl?${group.value}&${true}&${true}&${courses?.map((course) => course.value).join('-')}`;
      // let path = await fetch(url).then((data) => data.text());
      // return `https://tbschema.panivia.com/${path}`;
      // console.log(url);
    }
  }

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
                <div className={[styles.items, styles['items--checkboxes']].join(' ')}>
                  <label className={styles.checkbox}>
                    Förbättra platsfältet
                    <input name="mod1" type="checkbox" onChange={() => handleLocationChecked(!checkedLocation)}></input>
                    <span className={styles.checkbox__checkmark}></span>
                  </label>
                  <label className={styles.checkbox}>
                    Inkludera tentor och anmällan
                    <input name="mod2" type="checkbox" onChange={() => handleExamsChecked(!checkedExam)}></input>
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
                    <input className={styles.calendar_url__url_input} type="text" readOnly={true} value={urlInput} />
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
