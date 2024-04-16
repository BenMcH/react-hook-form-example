import { FormProvider, useFieldArray, useForm, useFormContext, } from 'react-hook-form';
import styles from './App.module.css'
import { Popover } from 'react-tiny-popover';
import { HexColorPicker } from 'react-colorful';
import { Fragment, useState } from 'react';

type Friend = {
  name?: string;
  email?: string;
  birthday?: string;

  favorites: {
    color?: string;
    number?: number;
  }
}

type FormData = {
  name: string;
  email: string;
  skills: { label: string }[];
  likesTypescript: 'YES' | 'NO' | 'YES_AGAIN';

  friends: Friend[];
}

function App() {
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      likesTypescript: 'YES',
      skills: [],
      friends: []
    }
  });

  return (
    <main className={styles.main}>
      <FormProvider {...form}>
        <form>
          <label>
            Name: <input type="text" {...form.register('name')} />
          </label>
          <label>
            Email: <input type="text" {...form.register('email')} />
          </label>
          <fieldset>
            Do you like Typescript?
            <label>
              <input type="radio" value="YES" {...form.register('likesTypescript')} /> Yes
            </label>
            <label>
              <input type="radio" value="NO" {...form.register('likesTypescript')} /> No
            </label>
            <label>
              <input type="radio" value="YES_AGAIN" {...form.register('likesTypescript')} /> Yes Again
            </label>
          </fieldset>
          <Skills />
          <Friends />

        </form>
      </FormProvider>

      <textarea disabled value={JSON.stringify(form.getValues(), null, 2)} />
    </main>
  )
}

function Skills() {
  const form = useFormContext<FormData>();
  const skills = useFieldArray<FormData>({ name: 'skills' });

  return (
    <>
      <button type="button" onClick={() => skills.append({ label: "" })}>Add Skill</button>

      {skills.fields.map((skill, index) =>
        <label key={skill.id}>
          Skill: <input type="text" {...form.register(`skills.${index}.label`)} />
          <button type="button" onClick={() => skills.remove(index)}>Remove</button>
        </label>
      )}
    </>)

}

function Friends() {
  const form = useFormContext<FormData>();
  const friends = useFieldArray<FormData, 'friends'>({ name: 'friends' });

  form.watch()

  return (
    <>
      <button type="button" onClick={() => friends.append({ favorites: { color: "#0000ff" } })}>Add Friend</button>

      {friends.fields.map((friend, index) =>
        <Fragment key={friend.id}>
          <Friend key={friend.id} friend={friend} index={index} remove={() => friends.remove(index)} />
        </Fragment>
      )}
    </>)
}

function Friend({ friend, index, remove }: { friend: Friend, index: number, remove: () => void }) {
  const form = useFormContext<FormData>();
  const [open, setOpen] = useState(false);

  return <div>
    <div>
      <label>
        Name: <input type="text" {...form.register(`friends.${index}.name`)} />
      </label>
      <label>
        Email: <input type="text" {...form.register(`friends.${index}.email`)} />
      </label>
      <label>
        Favorite color: <Popover
          isOpen={open}
          content={<HexColorPicker color={friend.favorites.color} onChange={color => form.setValue(`friends.${index}.favorites.color`, color)} />}
          onClickOutside={() => setOpen(false)}
        >
          <div style={{ backgroundColor: form.watch(`friends.${index}.favorites.color`), width: 20, height: 20 }} onClick={() => setOpen(true)} />
        </Popover>
      </label>
      <label>
        Native favorite color
        <input type="color" {...form.register(`friends.${index}.favorites.color`)} />
      </label>
      <label>
        Number: <input type="number" {...form.register(`friends.${index}.favorites.number`, { valueAsNumber: true })} />
      </label>
      <label>
        Birthday: <input type="date" {...form.register(`friends.${index}.birthday`)} />
      </label>
      {/* <label>
        Birthday: <input type="datetime-local" {...form.register(`friends.${index}.birthday`)} />
      </label> */}
    </div>
    <button type="button" onClick={remove}>Remove</button>
  </div>
}

export default App
