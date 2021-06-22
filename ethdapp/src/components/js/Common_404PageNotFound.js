import { Col, Container, Row } from "react-bootstrap";
import pageNotFoundPic from "../../images/common_404PageNotFoundPic.svg";

export const PageNotFound = () => {
    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col lg={12} md={12} sm={12}>
                        <img className="w-50" src={pageNotFoundPic} alt=" " />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
