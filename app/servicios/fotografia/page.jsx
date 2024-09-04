import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import ServiciosImg from '@/app/components/servicios-img.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';

//IMAGENES
import foto1 from '@/app/assets/img/servicios/MANOLO-BERNABEU-1.jpg';
import foto2 from '@/app/assets/img/servicios/BSN(13).jpg';
import foto3 from '@/app/assets/img/servicios/Delibreads-1.jpg';
import foto4 from '@/app/assets/img/servicios/WAY-6.jpg';
import foto5 from '@/app/assets/img/servicios/Delgo-53.jpg';
import foto6 from '@/app/assets/img/servicios/_DSF3001.jpg';
import foto7 from '@/app/assets/img/servicios/sin-título-1-Editar.png';
import foto8 from '@/app/assets/img/servicios/Baswtones_juntos.jpg';
import foto9 from '@/app/assets/img/servicios/Agosto_Wao_post-3.jpg';
import foto10 from '@/app/assets/img/servicios/vino.jpg';
import foto11 from '@/app/assets/img/servicios/principal.jpg';
import foto12 from '@/app/assets/img/servicios/11(1).jpg';



export default function FotografiaPage() {
    return (
    <Inner>
    <FotografiaLayout>
        <Servicios
            desktopwebm="https://www.ermo.es/videos/fotografia/FOTO_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/fotografia/FOTO_Mobile.webm"
            desktopmp4="https://www.ermo.es/videos/fotografia/FOTO_Desktop_1.mp4"
            mobilemp4="https://www.ermo.es/videos/fotografia/FOTO_Mobile_1.mp4"

            servicio="Fotografía de producto, gastronómica y corporativa"
           
            explicacion={ <>
                En ERMO sabemos que una imagen vale más que mil palabras, al menos cuando se trata de vender tus productos.
                <br></br><br></br>
                Cada foto que hacemos está destinada a resaltar el carácter de tus productos, creando composiciones visuales dinámicas que resultan llamativas para tus potenciales clientes. Este método no solo otorga notoriedad a tus productos frente a otros competidores, sino que también mejora la percepción y la profesionalidad de la marca.
                <br></br><br></br>
                No solo vas a convertir más tráfico con fotos asombrosas, sino que vas a construir una clientela que ame tu marca y que ame tu producto. Que pueda y sepa valorar la apariencia y la estética.
                <br></br><br></br>
                Contáctanos para aprender cómo nuestras soluciones de fotografía pueden aumentar tus ventas y mejorar el valor de tu marca.
            </>}
            
        ></Servicios>

<div className="servicios__imagenes master__body">
            <ServiciosImg src={foto1} alt="Manolo Bernabeu, CEO de Sanoguera Consulting. Fotografía tomada por Andrés Ortega Montoya" link="#"></ServiciosImg>
            <ServiciosImg src={foto2} alt="Bodegón de productos cosméticos de la empresa BSN Cosmetics" link="#"></ServiciosImg>
            <ServiciosImg src={foto3} alt="Wrap de trigo con arroz, tomate y vegetales de la empresa Delibreads" link="#"></ServiciosImg>
            <ServiciosImg src={foto4} alt="Tres trabajadores de la Agencia Valenciana de Publicidad WAY tomando un café" link="#"></ServiciosImg>
            <ServiciosImg src={foto5} alt="Zona de guardería de la empresa Delgo" link="#"></ServiciosImg>
            <ServiciosImg src={foto6} alt="Tratamiento de cuidado de pestañas de la empresa Lashes Duboh" link="#"></ServiciosImg>
            <ServiciosImg src={foto7} alt="Fotografía de producto para el aceite de oliva virgen extra Pagos de Guerrer" link="#"></ServiciosImg>
            <ServiciosImg src={foto8} alt="Montaje fotográfico de los bastones de Segorbina de Bastones en Segorbe" link="#"></ServiciosImg>
            <ServiciosImg src={foto9} alt="Fotografía de producto de la caja de WaoMochi hecha para la empresa Helados Estiu" link="#"></ServiciosImg>
            <ServiciosImg src={foto10} alt="Fotografía para Grupo Disber de una botella de vino sobre fondo negro" link="#"></ServiciosImg>
            <ServiciosImg src={foto11} alt="Fotografía gastronómica para el restaurante Sabora Gourmet" link="#"></ServiciosImg>
            <ServiciosImg src={foto12} alt="Fotografía publicitaria de una mujer rubia sosteniendo una copa para la empresa Cubers de Procubitos Europe" link="#"></ServiciosImg>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
    </Inner>
    );
  }
  