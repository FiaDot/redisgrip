import React from 'react';
import { Redirect } from 'react-router-dom/esm/react-router-dom';

export default function Home(): JSX.Element {
  /*
   TODO : react-router-dom 에 대한 이해도를 높일 때 까지 HomePage에서 Home을 부르고
      Redirect로 Servers페이지를 부르는 형태를 유지 한다.
      변경시 packaging 성공 후 실행시 제대로 동작 하지 않는 부분이 있다.
   */

  return (
    <Redirect push to="/redisgrip" />
  );
}
