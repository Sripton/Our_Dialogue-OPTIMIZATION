import React from "react";
import "./contentlist.css";

export default function Contentlist() {
  return (
    <div className="caorusel">
      <div className="caorusel-list">
        <div className="caorusel-item">
          <img src="./directions/biology.jpg" alt="biology" />
          <div className="caorusel-content">
            <div className="caorusel-title">Биология</div>
            <div className="caorusel-description">
              Четко определить границы биологии сложно, потому что эта наука
              иsзучает все аспекты жизни и буквально все, что с ней связано.
              Живые организмы непрерывно изменяются, обретают все новые и новые
              свойства, а значит, изучение биологии потенциально бесконечно.
              Поэтому главная задача биолога — непрерывный поиск ответов на
              вопросы о природе жизни при помощи научных методов.
            </div>
            <button type="submit" className="caorusel-button">
              Перейти
            </button>
          </div>
        </div>
        <div className="caorusel-item">
          <img src="./directions/chess.jpg" alt="chess" />
          <div className="caorusel-content">
            <div className="caorusel-title">Шахматы</div>
            <div className="caorusel-description">
              Считается, что история шахмат насчитывает не менее полутора тысяч
              лет. Известно множество версий, объясняющих развитие шахмат и их
              распространение во всём мире — «индийская», «византийская» и
              другие.
            </div>
            <button type="submit" className="caorusel-button">
              Перейти
            </button>
          </div>
        </div>
        <div className="caorusel-item">
          <img src="./directions/history.jpg" alt="history" />
          <div className="caorusel-content">
            <div className="caorusel-title">История</div>
            <div className="caorusel-description">
              История это перечень фактов. А трактовка исторических событий и их
              вымысел это не история,а попытка трактовать события в интересах
              какой либо общности людей или индивидиумов. Чтобы история стала
              наукой, она должна каждый раз давать окончательный
              причинно-следственный ответ на вопрос почему произошло явление и
              оформившее его событие вместе с ответом на вопрос где и когда это
              случилось.
            </div>
            <button type="submit" className="caorusel-button">
              Перейти
            </button>
          </div>
        </div>
        <div className="caorusel-item">
          <img src="./directions/math.jpg" alt="math" />
          <div className="caorusel-content">
            <div className="caorusel-title">Математика</div>
            <div className="caorusel-description">
              В этом разделе предлагаем обсудить различные математические задачи
              и проблемы, составленные Вами и не обязательно Вами, для которых
              Вы имеете решения. Обсуждение задач по математике, предлагавшихся
              на школьных и студенческих олимпиадах: региональных, национальных,
              международных. Обсуждение нетривиальных и нестандартных учебных
              задач Дискуссионные темы математики: попытки доказательства ВТФ и
              т.п.
            </div>
            <button type="submit" className="caorusel-button">
              Перейти
            </button>
          </div>
        </div>
      </div>

      <div className="thumbnail-list">
        <div className="thumbnail-item">
          <img src="./directions/biology.jpg" alt="biology" />
        </div>
        <div className="thumbnail-item">
          <img src="./directions/chess.jpg" alt="biology" />
        </div>

        <div className="thumbnail-item">
          <img src="./directions/history.jpg" alt="biology" />
        </div>
        <div className="thumbnail-item">
          <img src="./directions/math.jpg" alt="biology" />
        </div>
      </div>
    </div>
  );
}
