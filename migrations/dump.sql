--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1 (Ubuntu 13.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.1 (Ubuntu 13.1-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: movie; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.movie (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    poster character varying NOT NULL,
    stock integer NOT NULL,
    trailer character varying NOT NULL,
    "salePrice" double precision NOT NULL,
    "rentalPrice" double precision NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    available boolean NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.movie OWNER TO walter;

--
-- Name: movie_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movie_id_seq OWNER TO walter;

--
-- Name: movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.movie_id_seq OWNED BY public.movie.id;


--
-- Name: purchase; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.purchase (
    id integer NOT NULL,
    total integer NOT NULL,
    "purchaseDate" date DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "userId" integer
);


ALTER TABLE public.purchase OWNER TO walter;

--
-- Name: purchase_detail; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.purchase_detail (
    id integer NOT NULL,
    quantity integer NOT NULL,
    subtotal integer NOT NULL,
    "movieId" integer,
    "purchaseId" integer
);


ALTER TABLE public.purchase_detail OWNER TO walter;

--
-- Name: purchase_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.purchase_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchase_detail_id_seq OWNER TO walter;

--
-- Name: purchase_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.purchase_detail_id_seq OWNED BY public.purchase_detail.id;


--
-- Name: purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchase_id_seq OWNER TO walter;

--
-- Name: purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.purchase_id_seq OWNED BY public.purchase.id;


--
-- Name: rental; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.rental (
    id integer NOT NULL,
    total integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "rentalBeginDate" date DEFAULT now() NOT NULL,
    "rentalEndDate" date NOT NULL,
    "returnDate" date,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "userId" integer
);


ALTER TABLE public.rental OWNER TO walter;

--
-- Name: rental_detail; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.rental_detail (
    id integer NOT NULL,
    quantity integer NOT NULL,
    subtotal integer NOT NULL,
    "movieId" integer,
    "rentalId" integer
);


ALTER TABLE public.rental_detail OWNER TO walter;

--
-- Name: rental_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.rental_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rental_detail_id_seq OWNER TO walter;

--
-- Name: rental_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.rental_detail_id_seq OWNED BY public.rental_detail.id;


--
-- Name: rental_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.rental_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rental_id_seq OWNER TO walter;

--
-- Name: rental_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.rental_id_seq OWNED BY public.rental.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.role (
    id integer NOT NULL,
    "roleName" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.role OWNER TO walter;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_id_seq OWNER TO walter;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.tag OWNER TO walter;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO walter;

--
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- Name: tag_movies_movie; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.tag_movies_movie (
    "tagId" integer NOT NULL,
    "movieId" integer NOT NULL
);


ALTER TABLE public.tag_movies_movie OWNER TO walter;

--
-- Name: user; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "roleId" integer
);


ALTER TABLE public."user" OWNER TO walter;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO walter;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: uuid; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.uuid (
    id integer NOT NULL,
    uuid character varying NOT NULL,
    "userId" integer
);


ALTER TABLE public.uuid OWNER TO walter;

--
-- Name: uuid_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.uuid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.uuid_id_seq OWNER TO walter;

--
-- Name: uuid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.uuid_id_seq OWNED BY public.uuid.id;


--
-- Name: white_listed_tokens; Type: TABLE; Schema: public; Owner: walter
--

CREATE TABLE public.white_listed_tokens (
    id integer NOT NULL,
    "accesToken" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer
);


ALTER TABLE public.white_listed_tokens OWNER TO walter;

--
-- Name: white_listed_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: walter
--

CREATE SEQUENCE public.white_listed_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.white_listed_tokens_id_seq OWNER TO walter;

--
-- Name: white_listed_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: walter
--

ALTER SEQUENCE public.white_listed_tokens_id_seq OWNED BY public.white_listed_tokens.id;


--
-- Name: movie id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.movie ALTER COLUMN id SET DEFAULT nextval('public.movie_id_seq'::regclass);


--
-- Name: purchase id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.purchase ALTER COLUMN id SET DEFAULT nextval('public.purchase_id_seq'::regclass);


--
-- Name: purchase_detail id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.purchase_detail ALTER COLUMN id SET DEFAULT nextval('public.purchase_detail_id_seq'::regclass);


--
-- Name: rental id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.rental ALTER COLUMN id SET DEFAULT nextval('public.rental_id_seq'::regclass);


--
-- Name: rental_detail id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.rental_detail ALTER COLUMN id SET DEFAULT nextval('public.rental_detail_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: uuid id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.uuid ALTER COLUMN id SET DEFAULT nextval('public.uuid_id_seq'::regclass);


--
-- Name: white_listed_tokens id; Type: DEFAULT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.white_listed_tokens ALTER COLUMN id SET DEFAULT nextval('public.white_listed_tokens_id_seq'::regclass);


--
-- Data for Name: movie; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.movie (id, title, description, poster, stock, trailer, "salePrice", "rentalPrice", likes, available, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	Batman	Dark knight rieses	poster.com	250	trailer.com	39.99	15.99	500	t	2021-01-11 01:33:20.845315	2021-01-11 01:33:20.845315	\N
2	A night in paris	Romantic comedy	poster.com	68	trailer.com	25.99	10.5	137	f	2021-01-11 01:34:19.957593	2021-01-11 01:34:19.957593	\N
\.


--
-- Data for Name: purchase; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.purchase (id, total, "purchaseDate", "updatedAt", "deletedAt", "userId") FROM stdin;
\.


--
-- Data for Name: purchase_detail; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.purchase_detail (id, quantity, subtotal, "movieId", "purchaseId") FROM stdin;
\.


--
-- Data for Name: rental; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.rental (id, total, "isActive", "rentalBeginDate", "rentalEndDate", "returnDate", "updatedAt", "deletedAt", "userId") FROM stdin;
\.


--
-- Data for Name: rental_detail; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.rental_detail (id, quantity, subtotal, "movieId", "rentalId") FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.role (id, "roleName", "createdAt", "updatedAt") FROM stdin;
1	admin	2021-01-11 01:29:02.296784	2021-01-11 01:29:02.296784
2	client	2021-01-11 01:29:02.296784	2021-01-11 01:29:02.296784
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.tag (id, name, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	action	2021-01-11 01:34:56.198987	2021-01-11 01:34:56.198987	\N
2	violence	2021-01-11 01:34:56.204593	2021-01-11 01:34:56.204593	\N
3	superheroe	2021-01-11 01:34:56.205991	2021-01-11 01:34:56.205991	\N
4	comedy	2021-01-11 01:35:35.690648	2021-01-11 01:35:35.690648	\N
5	romance	2021-01-11 01:35:35.692407	2021-01-11 01:35:35.692407	\N
\.


--
-- Data for Name: tag_movies_movie; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.tag_movies_movie ("tagId", "movieId") FROM stdin;
1	1
2	1
3	1
5	2
4	2
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public."user" (id, email, password, "createdAt", "updatedAt", "deletedAt", "roleId") FROM stdin;
5	mywalter97@gmail.com	$2b$10$B.FBw9giiwJlQpmmHOL4dOWBaFN2.mYHD.9BDWW8TKkk2ESC6pt92	2021-01-11 01:31:16.49417	2021-01-11 01:31:16.49417	\N	2
1	admin@mail.com	$2b$10$nchRyPgGqimGMsT8jg7mu.wnwAlOeUKKw7GK03BpHJ3fu5.F.kQ8.	2021-01-11 01:29:48.684928	2021-01-11 01:29:48.684928	\N	1
2	client1@mail.com	$2b$10$rHZK6483LALGYXxBY2XmyemFj/SawzWLWgSuFUd79l9ZfO2Hy9ke2	2021-01-11 01:29:57.577977	2021-01-11 01:29:57.577977	\N	2
3	client2@mail.com	$2b$10$zYBQaYDhsy0Xmn7/YLyRY.W.Ggx.dkCr8r.ftTCqsl5gbHj4Z2Zxq	2021-01-11 01:30:02.298859	2021-01-11 01:30:02.298859	\N	2
4	client3@mail.com	$2b$10$yAtLA5oF.hxZsH77sxvKae4TTB4oes6i38rBE0kjN7w1VNTCxRwoK	2021-01-11 01:30:06.68417	2021-01-11 01:30:06.68417	\N	2
\.


--
-- Data for Name: uuid; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.uuid (id, uuid, "userId") FROM stdin;
\.


--
-- Data for Name: white_listed_tokens; Type: TABLE DATA; Schema: public; Owner: walter
--

COPY public.white_listed_tokens (id, "accesToken", "createdAt", "userId") FROM stdin;
1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InN1YiI6MSwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSJ9LCJpYXQiOjE2MTAzNTAzODIsImV4cCI6MTYxMDM1NzU4Mn0.K1n3mT4ZRg6AbqpI-ddh5VKgJAXoEfsYlsOrnv54Uto	2021-01-11 01:33:02.873967	1
\.


--
-- Name: movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.movie_id_seq', 2, true);


--
-- Name: purchase_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.purchase_detail_id_seq', 1, false);


--
-- Name: purchase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.purchase_id_seq', 1, false);


--
-- Name: rental_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.rental_detail_id_seq', 1, false);


--
-- Name: rental_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.rental_id_seq', 1, false);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.role_id_seq', 2, true);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.tag_id_seq', 5, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.user_id_seq', 5, true);


--
-- Name: uuid_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.uuid_id_seq', 1, false);


--
-- Name: white_listed_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: walter
--

SELECT pg_catalog.setval('public.white_listed_tokens_id_seq', 1, true);


--
-- Name: rental_detail PK_1c88f5cf28c50bc471cf2dcfa61; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.rental_detail
    ADD CONSTRAINT "PK_1c88f5cf28c50bc471cf2dcfa61" PRIMARY KEY (id);


--
-- Name: uuid PK_3776334769a96810ce5774e9d1e; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.uuid
    ADD CONSTRAINT "PK_3776334769a96810ce5774e9d1e" PRIMARY KEY (id);


--
-- Name: purchase PK_86cc2ebeb9e17fc9c0774b05f69; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.purchase
    ADD CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY (id);


--
-- Name: tag PK_8e4052373c579afc1471f526760; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY (id);


--
-- Name: rental PK_a20fc571eb61d5a30d8c16d51e8; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT "PK_a20fc571eb61d5a30d8c16d51e8" PRIMARY KEY (id);


--
-- Name: purchase_detail PK_b0988b2c3f2e1e5d95756b01389; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.purchase_detail
    ADD CONSTRAINT "PK_b0988b2c3f2e1e5d95756b01389" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: movie PK_cb3bb4d61cf764dc035cbedd422; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.movie
    ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY (id);


--
-- Name: white_listed_tokens PK_fc9bf3207c8bfa6e137eedda897; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.white_listed_tokens
    ADD CONSTRAINT "PK_fc9bf3207c8bfa6e137eedda897" PRIMARY KEY (id);


--
-- Name: tag_movies_movie PK_fe4a0f96297ce8e4093296b8f81; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.tag_movies_movie
    ADD CONSTRAINT "PK_fe4a0f96297ce8e4093296b8f81" PRIMARY KEY ("tagId", "movieId");


--
-- Name: tag UQ_6a9775008add570dc3e5a0bab7b; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE (name);


--
-- Name: role UQ_a6142dcc61f5f3fb2d6899fa264; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "UQ_a6142dcc61f5f3fb2d6899fa264" UNIQUE ("roleName");


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_116854feb958d78f80339c581a; Type: INDEX; Schema: public; Owner: walter
--

CREATE INDEX "IDX_116854feb958d78f80339c581a" ON public.tag_movies_movie USING btree ("tagId");


--
-- Name: IDX_c9f615f1d22012baa20b7dc807; Type: INDEX; Schema: public; Owner: walter
--

CREATE INDEX "IDX_c9f615f1d22012baa20b7dc807" ON public.tag_movies_movie USING btree ("movieId");


--
-- Name: tag_movies_movie FK_116854feb958d78f80339c581ae; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.tag_movies_movie
    ADD CONSTRAINT "FK_116854feb958d78f80339c581ae" FOREIGN KEY ("tagId") REFERENCES public.tag(id) ON DELETE CASCADE;


--
-- Name: purchase FK_33520b6c46e1b3971c0a649d38b; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.purchase
    ADD CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: rental FK_5c91d10c5ee7afddcb2dbbfbbd0; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT "FK_5c91d10c5ee7afddcb2dbbfbbd0" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: purchase_detail FK_6596b6e7b3814428ff49146cf5d; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.purchase_detail
    ADD CONSTRAINT "FK_6596b6e7b3814428ff49146cf5d" FOREIGN KEY ("purchaseId") REFERENCES public.purchase(id);


--
-- Name: purchase_detail FK_7bf31b824922b39b3fa4833c693; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.purchase_detail
    ADD CONSTRAINT "FK_7bf31b824922b39b3fa4833c693" FOREIGN KEY ("movieId") REFERENCES public.movie(id);


--
-- Name: uuid FK_af0e473b009d1a17bfa122b4164; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.uuid
    ADD CONSTRAINT "FK_af0e473b009d1a17bfa122b4164" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: user FK_c28e52f758e7bbc53828db92194; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES public.role(id);


--
-- Name: tag_movies_movie FK_c9f615f1d22012baa20b7dc807a; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.tag_movies_movie
    ADD CONSTRAINT "FK_c9f615f1d22012baa20b7dc807a" FOREIGN KEY ("movieId") REFERENCES public.movie(id) ON DELETE CASCADE;


--
-- Name: white_listed_tokens FK_dc1451a7cfca07e5f69b9c59673; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.white_listed_tokens
    ADD CONSTRAINT "FK_dc1451a7cfca07e5f69b9c59673" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: rental_detail FK_dd490f911c7263cb3eb6de20a0f; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.rental_detail
    ADD CONSTRAINT "FK_dd490f911c7263cb3eb6de20a0f" FOREIGN KEY ("rentalId") REFERENCES public.rental(id);


--
-- Name: rental_detail FK_e667322fc2321d47cf261759c6a; Type: FK CONSTRAINT; Schema: public; Owner: walter
--

ALTER TABLE ONLY public.rental_detail
    ADD CONSTRAINT "FK_e667322fc2321d47cf261759c6a" FOREIGN KEY ("movieId") REFERENCES public.movie(id);


--
-- PostgreSQL database dump complete
--

