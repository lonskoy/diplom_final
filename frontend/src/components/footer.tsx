import { FC } from "react";
import '../styles/footer.css'


export const Footer: FC = () => {
    return (
        <div className="footer_container">
            <div className="footer_title_container">
                <div className="footer_title">Исследуйте мир вместе с нами</div>
                <p className="footer_title_p">Открывайте для себя новые места и впечатления</p>
            </div>
            <div className="footer_link_container">
                <div className="footer_link_block">
                    <p className="footer_link_title">My Dream Place</p>
                    <ol className="footer_link_list">
                    <a href="#"><li className="footer_link_elem">Ваш спутник в путешествиях</li></a>
                    </ol>
                </div>
                <div className="footer_link_block">
                    <p className="footer_link_title">Компания</p>
                    <ol className="footer_link_list">
                        <a href="#"><li className="footer_link_elem">Вакансии</li></a>
                        <a href="#"><li className="footer_link_elem">Нововсти</li></a>
                        <a href="#"><li className="footer_link_elem">Реклама</li></a>
                        <a href="#"><li className="footer_link_elem">Связаться с нами</li></a>
                    </ol>
                </div>
                <div className="footer_link_block">
                    <p className="footer_link_title">Направления</p>
                    <ol className="footer_link_list">
                        <a href="#"><li className="footer_link_elem">Австралия</li></a>
                        <a href="#"><li className="footer_link_elem">Новая Зиландия</li></a>
                        <a href="#"><li className="footer_link_elem">Мальдивы</li></a>
                        <a href="#"><li className="footer_link_elem">Греция</li></a>
                        <a href="#"><li className="footer_link_elem">Сингапур</li></a>
                        <a href="#"><li className="footer_link_elem">США</li></a>
                    </ol>
                </div>
                <div className="footer_link_block">
                    <p className="footer_link_title">Условия и политика</p>
                    <ol className="footer_link_list">
                        <a href="#"><li className="footer_link_elem">Политика конфецидиальности</li></a>
                        <a href="#"><li className="footer_link_elem">Условия эксплуатации</li></a>
                        <a href="#"><li className="footer_link_elem">Политика системы вознаграждения</li></a>
                    </ol>
                </div>
                <div className="footer_link_block">
                    <p className="footer_link_title">Помощь</p>
                    <ol className="footer_link_list">
                        <a href="#"><li className="footer_link_elem">Поддержка</li></a>
                        <a href="#"><li className="footer_link_elem">Отмена бронирования</li></a>
                        <a href="#"><li className="footer_link_elem">Купоны</li></a>
                        <a href="#"><li className="footer_link_elem">Политика возврата</li></a>
                        <a href="#"><li className="footer_link_elem">Международные проездные документы</li></a>
                    </ol>
                </div>
            </div>
        </div>
    )
}