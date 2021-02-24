/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useEffect} from 'react';
// redux
import {connect} from 'react-redux';
import {
    setBackgroundColor1Action,
    setBackgroundColor5Action
} from '../actions';
// reactstrap
import {Container} from 'reactstrap';

/* ******************************************************** COMPONENT ********************************************************* */
function About(props) {

/* ******************************************************** USE EFFECT ********************************************************* */
useEffect(() => {
        // set background color of nav
        props.setBackgroundColor5Action(null);
        props.setBackgroundColor1Action('color-1');
    // eslint-disable-next-line
    }, []);

/* ******************************************************** RETURN ********************************************************* */
return (
        <Container className="px-4 px-sm-5 pb-0 pt-5 mt-5">
            <h1 className="adsimple-321232425">Impressum</h1>
            <p className="adsimple-321232425">Informationspflicht laut § 5 TMG.</p>
            <p className="adsimple-321232425"><strong>
                MusterFirma
                <br />
                Musterstrasse 1, Stiege 1 Tür 1, <br />
                12345 Musterhausen, <br />
                Deutschland
            </strong></p>
            <p className="adsimple-321232425">
                <strong>UID-Nummer:</strong> DE12345678
                <br />
                <strong>Wirtschafts-ID:</strong> DE123456789
                <br />
            </p>
            <p className="adsimple-321232425">
                <strong>Tel.:</strong> 01234/56789
                <br />
                <strong>Fax:</strong> 01234/56789-0
                <br />
                <strong>E-Mail:</strong> <a href="mailto:office@musterfirma.de">office@musterfirma.de</a>
            </p>
            <p className="adsimple-321232425">
                <strong>Aufsichtsbehörde</strong>
                <br />
                Bezirkshauptmannschaft Musterhausen
                <br />
                <strong>Webseite der Aufsichtsbehörde</strong>
                <br />
                <a href="https://www.aufsichtsbeoerde-musterhausen.de/">
                    https://www.aufsichtsbeoerde-musterhausen.de/
                </a>
                <br />
                <strong>Anschrift der Aufsichtsbehörde</strong>
                <br /> Musterweg 1, 12345 Musterhausen
                <br />
            </p>
            <p className="adsimple-321232425">
                <strong>Berufsbezeichnung:</strong> Webdesigner, Grafiker
            </p>
            <p className="adsimple-321232425">
                <strong>Vertreten durch</strong>
                <br />
                Markus Muster
            </p>
            <p>
                Quelle: Erstellt mit dem{' '}
                <a
                    title="Impressum Generator Deutschland"
                    href="https://www.adsimple.de/impressum-generator/"
                    rel="follow"
                >
                    Impressum Generator
                </a>{' '}
                von AdSimple in Kooperation mit{' '}
                <a href="https://www.justmed.de" rel="follow" title="">
                    justmed.de
                </a>
            </p>
            <br />
            <h2 className="adsimple-321232425">EU-Streitschlichtung</h2>
            <p>
                Gemäß Verordnung über Online-Streitbeilegung in Verbraucherangelegenheiten (ODR-Verordnung) möchten
                wir Sie über die Online-Streitbeilegungsplattform (OS-Plattform) informieren.
                <br />
                Verbraucher haben die Möglichkeit, Beschwerden an die Online Streitbeilegungsplattform der
                Europäischen Kommission unter{' '}
                <a
                    className="adsimple-321232425"
                    href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&amp;lng=DE"
                    rel="noopener"
                >
                    http://ec.europa.eu/odr?tid=321232425
                </a>{' '}
                zu richten. Die dafür notwendigen Kontaktdaten finden Sie oberhalb in unserem Impressum.
            </p>
            <p>
                Wir möchten Sie jedoch darauf hinweisen, dass wir nicht bereit oder verpflichtet sind, an
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
            <h2 className="adsimple-321232425">Haftung für Inhalte dieser Website</h2>
            <p>
                Wir entwickeln die Inhalte dieser Webseite ständig weiter und bemühen uns korrekte und aktuelle
                Informationen bereitzustellen. Laut Telemediengesetz{' '}
                <a
                    className="adsimple-321232425"
                    href="https://www.gesetze-im-internet.de/tmg/__7.html?tid=321232425"
                    rel="noopener"
                >
                    (TMG) §7 (1)
                </a>{' '}
                sind wir als Diensteanbieter für eigene Informationen, die wir zur Nutzung bereitstellen, nach den
                allgemeinen Gesetzen verantwortlich. Leider können wir keine Haftung für die Korrektheit aller
                Inhalte auf dieser Webseite übernehmen, speziell für jene die seitens Dritter bereitgestellt wurden.
                Als Diensteanbieter im Sinne der §§ 8 bis 10 sind wir nicht verpflichtet, die von ihnen
                übermittelten oder gespeicherten Informationen zu überwachen oder nach Umständen zu forschen, die
                auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
                Unsere Verpflichtungen zur Entfernung von Informationen oder zur Sperrung der Nutzung von
                Informationen nach den allgemeinen Gesetzen aufgrund von gerichtlichen oder behördlichen Anordnungen
                bleiben auch im Falle unserer Nichtverantwortlichkeit nach den §§ 8 bis 10 unberührt.{' '}
            </p>
            <p>
                Sollten Ihnen problematische oder rechtswidrige Inhalte auffallen, bitte wir Sie uns umgehend zu
                kontaktieren, damit wir die rechtswidrigen Inhalte entfernen können. Sie finden die Kontaktdaten im
                Impressum.
            </p>
            <h2 className="adsimple-321232425">Haftung für Links auf dieser Website</h2>
            <p>
                Unsere Webseite enthält Links zu anderen Webseiten für deren Inhalt wir nicht verantwortlich sind.
                Haftung für verlinkte Websites besteht für uns nicht, da wir keine Kenntnis rechtswidriger
                Tätigkeiten hatten und haben, uns solche Rechtswidrigkeiten auch bisher nicht aufgefallen sind und
                wir Links sofort entfernen würden, wenn uns Rechtswidrigkeiten bekannt werden.
            </p>
            <p>
                Wenn Ihnen rechtswidrige Links auf unserer Website auffallen, bitte wir Sie uns zu kontaktieren. Sie
                finden die Kontaktdaten im Impressum.
            </p>
            <br />
            <h2 className="adsimple-321232425">Urheberrechtshinweis</h2>
            <p>
                Alle Inhalte dieser Webseite (Bilder, Fotos, Texte, Videos) unterliegen dem Urheberrecht der
                Bundesrepublik Deutschland. Bitte fragen Sie uns bevor Sie die Inhalte dieser Website verbreiten,
                vervielfältigen oder verwerten wie zum Beispiel auf anderen Websites erneut veröffentlichen. Falls
                notwendig, werden wir die unerlaubte Nutzung von Teilen der Inhalte unserer Seite rechtlich
                verfolgen.
            </p>
            <p>
                Sollten Sie auf dieser Webseite Inhalte finden, die das Urheberrecht verletzen, bitten wir Sie uns
                zu kontaktieren.
            </p>
            <h2 className="adsimple-321232425">Bildernachweis</h2>
            <p>Die Bilder, Fotos und Grafiken auf dieser Webseite sind urheberrechtlich geschützt.</p>
            <p>Die Bilderrechte liegen bei den folgenden Fotografen und Unternehmen:</p>
            <ul className="adsimple-321232425 ml-4">
                <li className="adsimple-321232425">Fotograf Mustermann</li>
            </ul>
            <br />
            <br />
        </Container>
    );
}

/* ********************************************************* EXPORT ********************************************************* */
export default connect(null, {setBackgroundColor5Action, setBackgroundColor1Action})(About);
