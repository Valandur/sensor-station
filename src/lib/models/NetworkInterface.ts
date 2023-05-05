export interface NetworkInterface {
	name: string;
	addresses: NetworkInterfaceAddress[];
}

export interface NetworkInterfaceAddress {
	family: 'IPv4' | 'IPv6';
	address: string;
	mac: string;
}
