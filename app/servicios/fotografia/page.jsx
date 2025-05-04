import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import ServiciosImg from '@/app/components/servicios-img.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';

//IMAGENES
import foto1 from '@/app/assets/img/servicios/fotografia/MANOLO-BERNABEU-1.jpg';
import foto2 from '@/app/assets/img/servicios/fotografia/BSN(13).jpg';
import foto3 from '@/app/assets/img/servicios/fotografia/Delibreads-1.jpg';
import foto4 from '@/app/assets/img/servicios/fotografia/WAY-6.jpg';
import foto5 from '@/app/assets/img/servicios/fotografia/Delgo-53.jpg';
import foto6 from '@/app/assets/img/servicios/fotografia/_DSF3001.jpg';
import foto7 from '@/app/assets/img/servicios/fotografia/sin-título-1-Editar.png';
import foto8 from '@/app/assets/img/servicios/fotografia/Baswtones_juntos.jpg';
import foto9 from '@/app/assets/img/servicios/fotografia/Agosto_Wao_post-3.jpg';
import foto10 from '@/app/assets/img/servicios/fotografia/vino.jpg';
import foto11 from '@/app/assets/img/servicios/fotografia/principal.jpg';
import foto12 from '@/app/assets/img/servicios/fotografia/11(1).jpg';

//ICON
import instagram from '@/app/assets/icon/destacados/instagram.png';
import amazon from '@/app/assets/icon/destacados/amazon.png';
import arrow from '@/app/assets/icon/destacados/arrow.png';
import colab from '@/app/assets/icon/destacados/punos.png';



export default function FotografiaPage({municipio}) {


    
    
    return (
    <Inner>
    <FotografiaLayout municipio="en Cuenca">
        <Servicios
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746286660/FOTO_Desktop_1_k42ews.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746286659/FOTO_Mobile_1_prd4oj.mp4"

            servicio={<>Fotografía comercial y de producto {municipio}</>}
           
            explicacion={ <>
                En ERMO entendemos algo fundamental: <strong>una foto increíble puede vender más que el mejor discurso</strong>. Nos apasiona capturar la esencia de tus productos, creando imágenes que no solo llaman la atención, sino que enamoran a primera vista.
                <br></br><br></br>
                ¿El resultado? <strong>Tus productos destacan</strong> como nunca antes, y tu marca se eleva a otro nivel. No se trata solo de vender más (que lo harás), sino de crear una conexión real con tus clientes {municipio}. Queremos que se enamoren de tu marca, que valoren cada detalle.
                <br></br><br></br>
                ¿Te imaginas el impacto que esto puede tener en tu negocio? Hablemos. Descubre cómo nuestras fotos pueden transformar tu marca y disparar tus ventas.
            </>}

            imgcomp1={instagram}
            altcomp1="Logotipo de Instagram"
            destacado1="Mejor engagement en redes sociales"
            imgcomp2={amazon}
            altcomp2="Logotipo de Amazon"
            destacado2="Aumento de ventas en e-commerce"
            imgcomp3={arrow}
            altcomp3="icono de cursor"
            destacado3="Mejora de la tasa de clics (CTR)"
            imgcomp4={colab}
            altcomp4="icono de colaboración B2B"
            destacado4="Facilitación de colaboraciones B2B"
            
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
  