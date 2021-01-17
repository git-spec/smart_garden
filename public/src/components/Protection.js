/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useEffect} from 'react';
// redux
import {connect} from 'react-redux';
import {setBackgroundColor1Action, setBackgroundColor5Action} from '../actions';
// reactstrap
import {Container} from 'reactstrap';
// window dimension hook
import {useWindowDimension} from '../hooks/useWindowDimension';

/* ******************************************************** COMPONENT ********************************************************* */
function Protection(props) {
    // width of window
    const [width] = useWindowDimension();

    useEffect(() => {
        // set background color of nav
        props.setBackgroundColor5Action(null);
        props.setBackgroundColor1Action('color-1');
    // eslint-disable-next-line
    }, []);

/* ******************************************************** RETURN ********************************************************* */
    return (
        <Container className="px-4 px-md-0 pb-0 pt-5 mt-5">
            {width < 360 ? (
                <h1 class="adsimple-311242123">Datenschutz-{'\n'}erklärung</h1>
            ) : (
                <h1 class="adsimple-311242123">Datenschutzerklärung</h1>
            )}
            <br />
            <h2 class="adsimple-311242123">Datenschutz</h2>
            <p>Wir haben diese Datenschutzerklärung (Fassung 17.12.2020-311242123) verfasst, um Ihnen gemäß der Vorgaben der <a class="adsimple-311242123" href="https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679&amp;tid=311242123" target="_blank" rel="noopener noreferrer">Datenschutz-Grundverordnung (EU) 2016/679</a> zu erklären, welche Informationen wir sammeln, wie wir Daten verwenden und welche Entscheidungsmöglichkeiten Sie als Besucher dieser Webseite haben.</p>
            <p>Leider liegt es in der Natur der Sache, dass diese Erklärungen sehr technisch klingen, wir haben uns bei der Erstellung jedoch bemüht die wichtigsten Dinge so einfach und klar wie möglich zu beschreiben.</p>
            <p style={{marginTop: 15 + 'px'}}>Quelle: Erstellt mit dem <a title="Datenschutz Generator Deutschland" href="https://www.adsimple.de/datenschutz-generator/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>Datenschutz Generator</a> von AdSimple in Kooperation mit <a href="https://www.hashtagmann.de" target="_blank" rel="noopener noreferrer" title="">hashtagmann.de</a></p>
        </Container>
    );
}

/* ********************************************************* EXPORT ********************************************************* */
export default connect(null, {setBackgroundColor5Action, setBackgroundColor1Action})(Protection);
