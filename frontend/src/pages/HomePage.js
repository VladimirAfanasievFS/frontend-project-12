import { useDispatch, useSelector } from 'react-redux';
import { increment } from '../slices/counter';
import { useEffect } from 'react';
import axios from 'axios';
import { dataPath } from '../routes';

const HomePage = () => {
  const count = useSelector(state => state.counter.value);
  // Возвращает метод store.dispatch() текущего хранилища
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const token = JSON.parse(localStorage.getItem('userId'))?.token;
      const res = await axios.get(dataPath(), { headers: `Authorization: Bearer ${token}` });
      console.log('🚀 ~ file: HomePage.js:19 ~ fetchData ~ res:', res.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <h3>Page 1</h3>
      <div>Page 1 content: Page1</div>
      <button aria-label="Increment value" onClick={() => dispatch(increment())}>
        Прибавить
      </button>
      <span>{count}</span>
    </>
  );
};
export default HomePage;
