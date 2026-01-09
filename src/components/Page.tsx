import { JSXNode } from "@oomfware/jsx";

export const Page = (props: { children: JSXNode }) => {
    return <html>
		<head>
			<title>scrobbly</title>
			<link rel="stylesheet" type="text/css" href="/css" />
		</head>
		<body>
			<main>
				<h1>scrobbly</h1>
				{props.children}
			</main>
		</body>
	</html>;
};
